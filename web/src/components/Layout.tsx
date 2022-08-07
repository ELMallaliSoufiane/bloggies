import { Flex, useColorModeValue } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export const Layout = ({ children }: any) => {
  return (
    <>
      <Flex flexDirection={"column"} height={"100vh"}>
        <Navbar />
        <Flex
          mb={3}
          flexDirection={"column"}
          flex={1}
          bgColor={useColorModeValue("#f2f2f2", "#1A202C")}
        >
          {children}
        </Flex>
        <Footer />
      </Flex>
    </>
  );
};
