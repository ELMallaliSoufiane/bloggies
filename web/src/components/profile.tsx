import {
  Avatar,
  Flex,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export type ProfileProps = {
  username: string | undefined;
  title: string;
  description: string;
};

const Profile = ({ username, title, description }: ProfileProps) => {
  const textColor = useColorModeValue("#fafafa", "#050505");
  return (
    <Flex maxW="350px" bgColor={useColorModeValue("#f6af4a", "#0981b5")} p={8}>
      <VStack spacing={2}>
        <Avatar src="https://avatars.dicebear.com/api/male/username.svg" />
        <Text color={textColor}>{username}</Text>
        <Text fontSize="xs" color="gray.500">
          {title}
        </Text>
        <Text
          textAlign={"center"}
          fontSize={"sm"}
          noOfLines={4}
          color={textColor}
        >
          {description}
        </Text>
      </VStack>
    </Flex>
  );
};

export default Profile;
