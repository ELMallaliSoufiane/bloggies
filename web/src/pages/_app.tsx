import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
// import { createClient, Provider, dedupExchange, fetchExchange } from "urql";
// import { cacheExchange } from "@urql/exchange-graphcache";
// import {
//   LoginMutation,
//   LogoutMutation,
//   MeDocument,
//   MeQuery,
//   RegisterMutation,
// } from "../generated/graphql";

// const client = createClient({
//   url: "http://localhost:4000/graphql",
//   fetchOptions: {
//     credentials: "include",
//   },
//   exchanges: [
//     dedupExchange,
//     cacheExchange({
//       updates: {
//         Mutation: {
//           logout: (result: LogoutMutation, args, cache, info) => {
//             cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
//               console.log(data);
//               data = { me: null };
//               return data;
//             });
//           },
//           login: (result: LoginMutation, args, cache, info) => {
//             cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
//               console.log(data);
//               if (result.login.user) {
//                 if (data) {
//                   data = { me: { username: result.login.user.username } };
//                 }
//                 return data;
//               }
//               return data;
//             });
//           },
//           register: (result: RegisterMutation, args, cache, info) => {
//             cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
//               console.log(data);
//               if (result.register.user) {
//                 if (data) {
//                   data = { me: { username: result.register.user.username } };
//                 }
//                 return data;
//               }
//               return data;
//             });
//           },
//         },
//       },
//     }),
//     fetchExchange,
//   ],
// });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
