import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import "dotenv/config";

export const AppdataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  // host: "localhost",
  // port: 5432,
  // database: "rediclone",
  // username: "postgres",
  // password: "postgres",
  entities: [User, Post],
  synchronize: true,
  logging: true,
});
