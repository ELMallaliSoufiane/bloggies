import { Stack, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import ContentLayout from "../../components/ContentLayout";
import { Layout } from "../../components/Layout";
import PostWrapper from "../../components/PostWrapper";
import { usePostsQuery } from "../../generated/graphql";
import withApollo from "../../utils/withApollo";

const UserPosts = () => {
  const router = useRouter();
  type Vars = {
    limit: number;
    cursor: Date | null;
  };
  const userId =
    typeof router.query.userId === "string"
      ? parseInt(router.query.userId)
      : -1;
  const [vars, setVars] = useState<Vars>({
    limit: 10,
    cursor: null,
  });
  const { data, loading, fetchMore } = usePostsQuery({
    variables: { ...vars, userId },
  });

  const profile = {
    username: data?.posts.posts[0].user.username,
    title: "Developer",
    description:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
  };

  return (
    <>
      <Layout>
        <ContentLayout profile={true} profileProps={profile}>
          {loading ? (
            <div>loading...</div>
          ) : (
            <>
              <Stack shouldWrapChildren spacing={12}>
                {data?.posts.posts.map((p) => (
                  <PostWrapper post={p} />
                ))}
              </Stack>

              {data && data?.posts.hasMore ? (
                <Button
                  my={2}
                  mx={"auto"}
                  onClick={() => {
                    fetchMore({
                      variables: {
                        limit: vars.limit,
                        cursor: new Date(
                          Date.parse(
                            data?.posts.posts[data?.posts.posts.length - 1]
                              .createdAt
                          )
                        ),
                      },
                    });
                  }}
                >
                  Load More
                </Button>
              ) : (
                <Alert mt={10} status="info">
                  <AlertIcon />
                  You have reached the very earliest posts, it's the end of the
                  tunnel.
                </Alert>
              )}
            </>
          )}
        </ContentLayout>
      </Layout>
    </>
  );
};

export default withApollo({ ssr: true })(UserPosts);
