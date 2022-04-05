import { Box } from "@chakra-ui/react";

const Wrapper = ({ children }: any) => {
  return (
    <Box mt={8} mx="auto" maxW="600px">
      {children}
    </Box>
  );
};

export default Wrapper;
