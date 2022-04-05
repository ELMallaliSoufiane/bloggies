import { Box, Button, Flex, Input, Wrap } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import router from "next/router";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient";

const Login = () => {
  const [, login] = useLoginMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          if (response.data?.login.errors) {
            setErrors({
              username: response.data.login.errors[0].message,
            });
          } else if (response.data?.login.user) {
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
  );
};

export default withUrqlClient(urqlClient)(Login);
