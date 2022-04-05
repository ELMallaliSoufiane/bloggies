import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../utils/urqlClient";
import Link from "next/link";
const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
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
  );
};

export default withUrqlClient(urqlClient)(Register);
