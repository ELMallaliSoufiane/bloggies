import { Box, Button, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import router from "next/router";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useAuth } from "../utils/useAuth";
import withApollo from "../utils/withApollo";

const createPost = () => {
  const [createPost] = useCreatePostMutation();
  const { data } = useMeQuery();
  useAuth();
  return (
    <Layout>
      <Wrapper>
        {data?.me?.active ? (
          <Formik
            initialValues={{ title: "", body: "" }}
            onSubmit={async (values) => {
              const post = await createPost({
                variables: { options: values },
                update: (cache) => {
                  cache.evict({ fieldName: "posts" });
                },
              });
              if (post.errors) {
                router.push("/login");
              }
              if (post.data?.createPost?.id) {
                router.push(`/post/${post.data.createPost.id}`);
              }
            }}
          >
            {({ values, isSubmitting }) => (
              <Form>
                <InputField
                  label="Title"
                  value={values.title}
                  style={{
                    backgroundColor: useColorModeValue("whitesmoke", "#1A202C"),
                  }}
                  name="title"
                />
                <InputField
                  label="Body"
                  textarea
                  style={{
                    backgroundColor: useColorModeValue("whitesmoke", "#1A202C"),
                  }}
                  value={values.body}
                  name="body"
                />
                <Box mt={4} display={"flex"} alignItems={"center"}>
                  <Button
                    mr={2}
                    type="submit"
                    colorScheme={"twitter"}
                    isLoading={isSubmitting}
                  >
                    Submit post
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <Text>Your Account is disabled, please enable your account!</Text>{" "}
            <NextLink href={"/settings"}>
              <Link>{"-->"} Settings</Link>
            </NextLink>
          </>
        )}
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(createPost);
