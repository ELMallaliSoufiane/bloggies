import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { LocalContext } from "src/types";
import { User } from "../entities/User";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  body: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts() {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number) {
    const post = await Post.findOneBy({ id });
    console.log(post?.user);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async createPost(
    @Arg("options") options: PostInput,
    @Ctx() { req }: LocalContext
  ) {
    const user = await User.findOneBy({ id: req.session.userId });
    if (user) return Post.create({ ...options, user: user }).save();
    return null;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(@Arg("id") id: number, @Arg("title") title: string) {
    const post = await Post.findOneBy({ id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number) {
    await Post.delete({ id });

    return true;
  }
}
