import { User } from "../entities/User";
import { LocalContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isEnabled: MiddlewareFn<LocalContext> = async (
  { context },
  next
) => {
  const user = await User.findOneBy({ id: context.req.session.userId });
  if (user?.active) {
    return next();
  }
  throw new Error("Account Disabled");
};
