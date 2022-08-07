import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { LocalContext } from "src/types";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { AppdataSource } from "../data-source";
import { isEnabled } from "../middleware/isEnabled";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  body: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver()
export class PostResolver {
  // @Query(() => [Post])
  // async posts(
  //   @Arg("limit", () => Int) limit: number,
  //   @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  // ) {
  //   const maxLimit = Math.min(50, limit);
  //   const qb = await AppdataSource.getRepository(Post)
  //     .createQueryBuilder("p")
  //     // .where("p.id = :id", { id: 1 })
  //     .take(maxLimit)
  //     .orderBy('"createdAt"', "DESC");

  //   if (cursor) {
  //     qb.where("p.createdAt < :cursor", { cursor });
  //   }

  //   return qb.getMany();
  // }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Date, { nullable: true }) cursor: Date | null,
    @Arg("userId", () => Int, { nullable: true }) userId: number | null
  ): Promise<PaginatedPosts> {
    const maxLimit = Math.min(50, limit);
    const limitPlusOne = maxLimit + 1;

    // const postss = await AppdataSource.query(`select p.* from post p ${cursor ? 'where p."createdAt" < $2' : ''} ${userId ? ''}`)

    const qb = await AppdataSource.getRepository(Post).createQueryBuilder("p");
    // .where("p.id = :id", { id: 1 })
    if (userId) {
      qb.leftJoinAndSelect(`p.user`, "user");
    }
    if (userId) qb.where('p."userId" = :userId', { userId });
    if (cursor) {
      qb.andWhere('p."createdAt" < :cursor', { cursor });
    }

    qb.orderBy('p."createdAt"', "DESC");

    qb.limit(limitPlusOne);
    const posts = await qb.printSql().getMany();

    // const posts = await AppdataSource.getRepository(Post).query(
    //   `select p.* from post p INNER JOIN "user" us ON p."userId" = "us"."id" ${
    //     userId ? ` where p."userId" = $2` : ""
    //   } ${
    //     cursor
    //       ? userId
    //         ? `AND p."createdAt" < $3`
    //         : `where p."createdAt" < $3`
    //       : ""
    //   } order by p."createdAt" DESC limit $1 `,
    //   [limitPlusOne, userId, cursor]
    // );

    return {
      posts: posts.slice(0, maxLimit),
      hasMore: posts.length === limitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number) {
    const post = await Post.findOneBy({ id });
    console.log(post?.user);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth, isEnabled)
  async createPost(
    @Arg("options") options: PostInput,
    @Ctx() { req }: LocalContext
  ) {
    const user = await User.findOneBy({ id: req.session.userId });
    if (user) return Post.create({ ...options, user: user }).save();
    return null;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth, isEnabled)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Arg("body") body: string,
    @Ctx() { req }: LocalContext
  ) {
    const post = await Post.findOneBy({ id });
    if (!post) {
      return null;
    }
    const creator = await post.user;
    if (creator.id !== req.session.userId) {
      return null;
    }
    await Post.update({ id: post.id }, { title, body });
    const result = await Post.findOneBy({ id });
    // const result = await Post.createQueryBuilder()
    //   .update({
    //     title,
    //     body,
    //   })
    //   .where({ id: post.id })
    //   .returning("*")
    //   .execute();
    // console.log(result);
    return result;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth, isEnabled)
  async deletePost(@Arg("id") id: number) {
    const post = await Post.findOneBy({ id });
    if (post) {
      await Post.delete({ id });
      return true;
    }
    return false;
  }
}
