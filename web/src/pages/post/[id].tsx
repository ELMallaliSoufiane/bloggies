import {
  Alert,
  AlertIcon,
  Heading,
  Spinner,
  Box,
  Flex,
  Text,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { getDateAgo } from "../../utils/getCreatedAgo";
import withApollo from "../../utils/withApollo";

const Post = () => {
  const router = useRouter();
  const id =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const { data, error, loading } = usePostQuery({ variables: { id } });

  if (loading) {
    return (
      <Layout>
        <Spinner></Spinner>
      </Layout>
    );
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          could not find post!
        </Alert>
      </Layout>
    );
  }
  return (
    <Layout>
      <Container>
        <Flex
          flexDirection={"column"}
          minW={"600px"}
          // justifyContent={"center"}
          alignItems={"center"}
          my={10}
        >
          <Heading as="h5">{data.post.title}</Heading>
          <Text fontSize={"xs"}>{`created by ${
            data.post.user.username
          } ${getDateAgo(Date.parse(data.post.createdAt))}`}</Text>

          <Box mt={8}>{data.post.body}</Box>
        </Flex>
      </Container>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
