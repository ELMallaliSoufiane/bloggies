import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import EditModal from "./EditModal";
interface userInfoProps {
  username: string;
  avatar: string;
  email: string;
}

const UserInfo = (props: userInfoProps) => {
  return (
    <Flex flexDir={"column"} minW="500px">
      <Flex flexDirection="row" justifyContent={"center"} alignItems="center">
        <Avatar size={"lg"} src={props.avatar} />
        <Heading ml={10} size={"lg"}>
          {props.username}
        </Heading>
      </Flex>

      <Flex
        mt={10}
        width={"100%"}
        p={10}
        backgroundColor={useColorModeValue("gray.300", "gray.900")}
        flexDir={"column"}
      >
        <Flex width={"100%"}>
          <Flex
            flexDir={"column"}
            justifyContent="space-between"
            alignContent={"space-between"}
            width="100%"
          >
            <Text fontSize={"md"}>USERNAME</Text>
            <Text fontSize={"xl"}>{props.username}</Text>
          </Flex>
          <EditModal label="username" currentValue={props.username} />
        </Flex>
        <Flex width={"100%"} mt={5}>
          <Flex
            flexDir={"column"}
            justifyContent="space-between"
            alignContent={"space-between"}
            width="100%"
          >
            <Text fontSize={"md"}>EMAIL</Text>
            <Text fontSize={"xl"}>{props.email}</Text>
          </Flex>
          <EditModal label="email" currentValue={props.email} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserInfo;
