import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

declare module "express-session" {
  interface Session {
    userId: number;
  }
}
export type LocalContext = {
  req: Request & { session: Session };
  redis: Redis;
  res: Response;
};
