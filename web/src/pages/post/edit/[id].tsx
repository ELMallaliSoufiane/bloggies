import { useColorModeValue, Box, Button, Text, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import Wrapper from "../../../components/Wrapper";
import {
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import withApollo from "../../../utils/withApollo";
import createPost from "../../create-post";

const EditPost = () => {
  const router = useRouter();
  const id =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const { data, error, loading } = usePostQuery({ variables: { id } });

  const Me = useMeQuery();

  const [updatePost] = useUpdatePostMutation();

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }
  if (!data?.post) {
    return <Layout>Couldn't find the post</Layout>;
  }

  return (
    <Layout>
      <Wrapper>
        {Me.data?.me?.username === data.post.user.username ? (
          Me.data?.me?.active ? (
            <Formik
              initialValues={{ title: data.post.title, body: data.post.body }}
              onSubmit={async (values, { setErrors }) => {
                const updatedPost = await updatePost({
                  variables: { id, title: values.title, body: values.body },
                });
                console.log(updatedPost);
                if (updatedPost.data?.updatePost?.id) {
                  console.log("what?");
                  router.push(`/post/${id}`);
                }
                if (updatedPost.errors) {
                  setErrors({
                    title: "Oups, something weird happened. Try Again later!",
                  });
                }
              }}
            >
              {({ values, isSubmitting }) => (
                <Form>
                  <InputField
                    label="Title"
                    value={values.title}
                    style={{
                      backgroundColor: useColorModeValue(
                        "whitesmoke",
                        "#1A202C"
                      ),
                    }}
                    name="title"
                  />
                  <InputField
                    label="Body"
                    textarea
                    style={{
                      backgroundColor: useColorModeValue(
                        "whitesmoke",
                        "#1A202C"
                      ),
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
                      Edit post
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
          )
        ) : (
          <div>you can't edit this post</div>
        )}
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
