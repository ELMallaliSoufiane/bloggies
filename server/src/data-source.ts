import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const AppdataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "rediclone",
  username: "postgres",
  password: "postgres",
  entities: [User, Post],
  synchronize: true,
  logging: true,
});
