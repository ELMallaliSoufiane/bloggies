import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, VStack, Text, StackDivider } from "@chakra-ui/react";

export const LabelList = () => {
  const LABELS: Array<string> = ["Design", "IT", "Ecommerce"];
  return (
    <Flex minW="350px" direction={"column"} maxW="full" p={8}>
      <Text fontSize={"lg"}>LABELS</Text>
      <VStack
        mt={5}
        flex={1}
        divider={<StackDivider borderColor="gray.200" />}
        spacing={6}
      >
        {LABELS.map((label) => (
          <Flex alignItems={"center"} minW="full" justify={"space-between"}>
            <Text>{label}</Text>
            <ArrowForwardIcon />
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
};
