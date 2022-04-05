import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
//import Redis from "redis";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { COOKIE_NAME, IS_PROD } from "./globals";
import { AppdataSource } from "./data-source";

const main = async () => {
  AppdataSource.initialize()
    .then(() => {
      console.log("db set up!");
    })
    .catch((err) => {
      console.log(err);
    });

  // const orm = await MikroORM.init(mikroConfig);
  // // await orm.em.nativeDelete(User, {});
  // await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // redisClient.on("connect", function () {
  //   console.log("Connected to redis successfully");
  // });

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        //path: "./tmp/sessions/",
        // domain: undefined,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
        httpOnly: true,
        secure: IS_PROD, // turn it to true in prod. (make cookie work only in https)
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "asdsadaskljdlasjd",
      resave: false,
    })
  );
  // await redisClient.connect();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on port 4000");
  });

  //   const posts = await orm.em.find(Post, {});
  //   console.log(posts);
};

main();
