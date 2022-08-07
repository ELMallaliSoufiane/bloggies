import { Box, Container } from "@chakra-ui/react";

const Wrapper = ({ children }: any) => {
  return (
    <Container p={0} mt={8}>
      {children}
    </Container>
  );
};

export default Wrapper;
