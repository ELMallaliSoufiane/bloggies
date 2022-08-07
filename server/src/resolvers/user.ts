import { LocalContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKIE_NAME, FG_PREFIX } from "../globals";
import { v4 } from "uuid";
import { sendMail } from "../utils/sendMail";
import { isAuth } from "../middleware/isAuth";
import { isEnabled } from "../middleware/isEnabled";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
}

@InputType()
class LoginInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

// @InputType()
// class UpdateInput {
//   @Field({ nullable: true })
//   username: string;

//   @Field({ nullable: true })
//   email?: string;
// }

@InputType()
class UpdateInput {
  @Field({ nullable: true })
  username: string;
  @Field({ nullable: true })
  email: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: LocalContext
  ) {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username is not long enough",
          },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "password is not long enough",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const { username, email } = options;
    let user: User;
    //console.log(user);
    try {
      user = await User.create({
        username,
        email,
        password: hashedPassword,
      }).save();
    } catch (exp) {
      return {
        errors: [
          {
            field: "general",
            message: exp.detail,
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: LocalContext) {
    if (req.session.userId) {
      const user = await User.findOneBy({ id: req.session.userId });
      if (!user) {
        return null;
      }
      return user;
    }
    return null;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { req }: LocalContext
  ) {
    const user = await User.findOneBy({ username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "doesnt exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "not correct!",
          },
        ],
      };
    }

    req.session.userId = user.id;
    console.log(req);
    console.log(req.session);
    console.log("test");
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: LocalContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: LocalContext
  ) {
    const user = await User.findOneBy({ email });
    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(FG_PREFIX + token, user.id, "EX", 1000 * 60 * 60 * 24 * 3);
    await sendMail(
      email,
      `<a href="http://localhost:3000/change-password/${token}"> Change Password </a>`
    );

    return true;
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis }: LocalContext
  ) {
    const id = await redis.get(FG_PREFIX + token);

    if (id) {
      const idnum = parseInt(id);
      const pass = await argon2.hash(newPassword);
      const user = await User.findOneBy({ id: idnum });
      if (!user) {
        return false;
      }
      User.update({ id: user.id }, { password: pass });
      redis.del(FG_PREFIX + token);
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async passwordmodif(
    @Arg("oldPassword") oldPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req }: LocalContext
  ) {
    const user = await User.findOneBy({ id: req.session.userId });
    if (!user) {
      return false;
    }
    const valid = await argon2.verify(user.password, oldPassword);
    if (valid) {
      const password = await argon2.hash(newPassword);
      User.update({ id: user.id }, { password });
      return true;
    }
    return false;
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth, isEnabled)
  async updateUser(
    @Arg("updateInput") updateInput: UpdateInput,
    @Ctx() { req }: LocalContext
  ) {
    const user = await User.findOneBy({ id: req.session.userId });

    if (!user) {
      return false;
    }
    await User.update({ id: user.id }, updateInput);
    const updatedUser = await User.findOneBy({ id: user.id });
    return updatedUser;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async toggleUserEnability(
    @Arg("password") password: string,
    @Ctx() { req }: LocalContext
  ) {
    const user = await User.findOneBy({ id: req.session.userId });
    if (!user) {
      return false;
    }
    const valid = await argon2.verify(user.password, password);
    if (valid) {
      await User.update({ id: user.id }, { active: !user.active });
      return true;
    }
    return false;
  }
}
