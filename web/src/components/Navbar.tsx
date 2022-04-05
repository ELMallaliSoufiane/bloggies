import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

const Navbar = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  console.log(data);
  const [, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
  } else if (data?.me) {
    body = (
      <>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          variant={"link"}
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </>
    );
  } else {
    body = (
      <>
        {" "}
        <Box mr={4}>
          <Link href="/register">Register</Link>
        </Box>
        <Box>
          <Link href="/login">Login</Link>
        </Box>
      </>
    );
  }
  return (
    <Flex bg="teal">
      <Box p={4} ml={"auto"} display={"flex"} flexDirection={"row"}>
        {body}
      </Box>
    </Flex>
  );
};

export default Navbar;
