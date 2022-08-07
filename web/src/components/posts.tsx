import { Alert, AlertIcon, Button, Stack } from "@chakra-ui/react";
import type { SetStateAction } from "react";
import { PostsQuery, UserPostsQuery } from "../generated/graphql";
import PostWrapper from "./PostWrapper";

type Vars = {
  limit: number;
  cursor: Date | null;
};

export type PostsType = Array<{
  __typename?: "Post";
  id: number;
  title: string;
  body: string;
  createdAt: any;
  user: { __typename?: "User"; id: number; username: string };
}>;

interface PostsProps {
  data: PostsType | undefined;
  setVariables: (value: SetStateAction<Vars>) => void;
  limit: number;
  hasMore: boolean | undefined;
  fetchMore: any;
}

const Posts = ({ data, hasMore, setVariables, limit }: PostsProps) => {
  return (
    <>
      <Stack shouldWrapChildren spacing={12}>
        {data?.map((p) => (
          <PostWrapper post={p} />
        ))}
      </Stack>

      {data && hasMore ? (
        <Button
          my={2}
          mx={"auto"}
          onClick={() => {
            setVariables((variables) => ({
              ...variables,
              limit,
              cursor: new Date(Date.parse(data[data.length - 1].createdAt)),
            }));
          }}
        >
          Load More
        </Button>
      ) : (
        <Alert mt={10} status="info">
          <AlertIcon />
          You have reached the very earliest posts, it's the end of the tunnel.
        </Alert>
      )}
    </>
  );
};

export default Posts;
