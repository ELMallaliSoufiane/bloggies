import { Alert, AlertIcon, Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import { useState } from "react";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { urqlClient } from "../utils/urqlClient";

const forgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [message, setMessage] = useState("");
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await forgotPassword({ email: values.email });
          if (response.data?.forgotPassword) {
            setMessage("an email was sent containing the reset password link");
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <InputField
              label="email"
              value={values.email}
              name="email"
              type="email"
              required
            />
            <Button my={4} type="submit" color="teal" isLoading={isSubmitting}>
              Reset Password
            </Button>
            {message ? (
              <Alert status="success">
                <AlertIcon />
                {message}
              </Alert>
            ) : null}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(urqlClient)(forgotPassword);
