import {
  Flex,
  Image,
  VStack,
  Text,
  Link,
  Heading,
  color,
  IconButton,
} from "@chakra-ui/react";
import { getDateAgo } from "../utils/getCreatedAgo";
import NextLink from "next/link";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { AlertDelete } from "./AlertDelete";

interface Post {
  __typename?: "Post" | undefined;
  id: number;
  title: string;
  body: string;
  createdAt: any;
  user: {
    __typename?: "User" | undefined;
    username: string;
  };
}

const PostWrapper = ({ post }: any) => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  return (
    <Flex>
      <VStack alignItems={"flex-start"}>
        <Image
          src="https://via.placeholder.com/600x300"
          fallbackSrc="https://via.placeholder.com/600x300"
        />
        <Flex justifyContent={"space-between"} width="100%">
          <VStack alignItems={"flex-start"} width="100%">
            <Text color="gray.500" fontSize={"xs"}>{`Posted By ${
              post.user.username
            }, ${getDateAgo(Date.parse(post.createdAt))} `}</Text>
            <NextLink href={`/post/${post.id}`}>
              <Link>
                <Heading as="h6" size={"xs"} maxW={"400px"}>
                  {post.title}
                </Heading>
              </Link>
            </NextLink>
          </VStack>
          <Flex>
            {data?.me?.username === post.user.username && data?.me?.active ? (
              <>
                <NextLink href={`/post/edit/${post.id}`}>
                  <IconButton aria-label="edit post" icon={<EditIcon />} />
                </NextLink>
                <AlertDelete id={post.id} />
              </>
            ) : (
              ""
            )}
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default PostWrapper;
