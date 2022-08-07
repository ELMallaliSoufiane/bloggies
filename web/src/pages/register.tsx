import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import Link from "next/link";
import withApollo from "../utils/withApollo";
import { Layout } from "../components/Layout";
const Register = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Layout>
      <Wrapper>
        <Formik
          initialValues={{ username: "", password: "", email: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              variables: { options: values },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register.user,
                  },
                });
              },
            });
            if (response.data?.register.errors) {
              setErrors({
                username: response.data.register.errors[0].message,
              });
            } else if (response.data?.register.user) {
              router.push("/");
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
                label="email"
                value={values.email}
                name="email"
                type="email"
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
                  register
                </Button>
                <Link href="/login">have an account? login</Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Register);
