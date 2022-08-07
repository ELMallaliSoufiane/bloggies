import { Container, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import { LabelList } from "./LabelList";
import Profile, { ProfileProps } from "./profile";

type ContentLayoutProps = {
  profileProps: ProfileProps;
  profile: boolean;
  children: JSX.Element;
};

const ContentLayout = ({
  profileProps,
  profile,
  children,
}: ContentLayoutProps) => {
  return (
    <Container maxW="container.xl" p={0}>
      <Flex py={10}>
        <Grid templateColumns={{ base: "repeat(1,1fr)", md: "repeat(3,1fr)" }}>
          <GridItem colSpan={{ base: 1, md: 2 }}>{children}</GridItem>
          <GridItem colSpan={1}>
            <VStack spacing={10}>
              {profile && (
                <Profile
                  username={profileProps.username}
                  description={profileProps.description}
                  title={profileProps.title}
                />
              )}
              <LabelList />
            </VStack>
          </GridItem>
        </Grid>
      </Flex>
    </Container>
  );
};

export default ContentLayout;
