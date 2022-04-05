import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { Link } from "@chakra-ui/react";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { urqlClient } from "../../utils/urqlClient";
import NextLink from "next/link";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const [message, setMessage] = useState("");
  return (
    <Wrapper>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          console.log(response);
          if (response.data?.changePassword) {
            setMessage("password reset successfully");
          } else {
            setErrors({ newPassword: "token expired" });
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <InputField
              label="new Password"
              value={values.newPassword}
              name="newPassword"
              type="password"
            />
            <Button mt={4} type="submit" color="teal" isLoading={isSubmitting}>
              Change Password
            </Button>
            {message ? (
              <Alert status="success">
                <AlertIcon />
                {message + "   "}{" "}
                <NextLink href="/login">
                  <Link mx={4}>Log in!</Link>
                </NextLink>
              </Alert>
            ) : null}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};
export default withUrqlClient(urqlClient)(ChangePassword);
