import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange, ssrExchange } from "urql";
import {
  LogoutMutation,
  MeDocument,
  MeQuery,
  LoginMutation,
  RegisterMutation,
} from "../generated/graphql";

export const urqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (result: LogoutMutation, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
              console.log(data);
              data = { me: null };
              return data;
            });
          },
          login: (result: LoginMutation, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
              console.log(data);
              if (result.login.user) {
                if (data) {
                  data = { me: { username: result.login.user.username } };
                }
                return data;
              }
              return data;
            });
          },
          register: (result: RegisterMutation, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
              console.log(data);
              if (result.register.user) {
                if (data) {
                  data = { me: { username: result.register.user.username } };
                }
                return data;
              }
              return data;
            });
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
