import { Button, Alert, AlertIcon, useColorModeValue } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useState } from "react";
import { usePasswordmodifMutation } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import withApollo from "../../utils/withApollo";
const PasswordModif = () => {
  const [changePassword] = usePasswordmodifMutation();
  const [message, setMessage] = useState("");

  return (
    <Layout>
      <Wrapper>
        <Formik
          initialValues={{ oldPassword: "", newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({ variables: values });
            if (response.data?.passwordmodif) {
              setMessage("password changed successfuly");
            } else {
              setErrors({ oldPassword: "the old password is wrong!" });
            }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <InputField
                label="Enter your current Password"
                value={values.oldPassword}
                style={{
                  backgroundColor: useColorModeValue("whitesmoke", "#1A202C"),
                  marginBottom: "10px",
                }}
                name="oldPassword"
                type="password"
              />
              <InputField
                label="Enter your new password"
                value={values.newPassword}
                style={{
                  backgroundColor: useColorModeValue("whitesmoke", "#1A202C"),
                }}
                name="newPassword"
                type="password"
              />
              <Button
                mt={4}
                type="submit"
                colorScheme={"twitter"}
                isLoading={isSubmitting}
              >
                Change Password
              </Button>
              {message ? (
                <Alert status="success">
                  <AlertIcon />
                  {message + "   "}{" "}
                </Alert>
              ) : null}
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PasswordModif);
