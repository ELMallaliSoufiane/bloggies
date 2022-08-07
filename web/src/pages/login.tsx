import { Box, Button, Flex, Input, Wrap } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import router from "next/router";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { Layout } from "../components/Layout";
import withApollo from "../utils/withApollo";

const Login = () => {
  const [login] = useLoginMutation();
  return (
    <Layout>
      <Wrapper>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({
              variables: { options: values },
              update(cache, { data }) {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.login.user,
                  },
                });
              },
            });
            if (response.data?.login.errors) {
              setErrors({
                username: response.data.login.errors[0].message,
              });
            } else if (response.data?.login.user) {
              if (typeof router.query.next == "string")
                router.push(router.query.next);
              else {
                router.push("/");
              }
            }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <InputField
                label="username"
                value={values.username}
                name="username"
              />
              <InputField
                label="password"
                value={values.password}
                name="password"
                type="password"
              />
              <Box mt={4} display={"flex"} alignItems={"center"}>
                <Button
                  mr={2}
                  type="submit"
                  color="teal"
                  isLoading={isSubmitting}
                >
                  login
                </Button>
                <NextLink href="/forgotPassword">
                  <Link ml={"auto"}>forgot password?</Link>
                </NextLink>
              </Box>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
