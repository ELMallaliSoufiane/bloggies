import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import EditModal from "../../components/EditModal";
import { Layout } from "../../components/Layout";
import UserInfo from "../../components/userInfo";
import Wrapper from "../../components/Wrapper";
import { useMeQuery } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";
import withApollo from "../../utils/withApollo";

const Settings = () => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  return (
    <Layout>
      {data?.me ? (
        <Wrapper>
          <Heading mb={10} as={"h5"} size={"lg"}>
            My Account
          </Heading>
          <UserInfo
            username={data.me.username}
            email={data.me.email}
            avatar="https://avatars.dicebear.com/api/male/username.svg"
          />
          <Heading my={10} size={"lg"}>
            Password and Authentication
          </Heading>
          <Button colorScheme={"twitter"}>
            <Link href={"/settings/password"}>Change Password</Link>
          </Button>

          <Heading my={10} size="md">
            Account Removal
          </Heading>
          <Text mb={10} color={"gray.500"}>
            Disabling your account means you can recover it at anytime after
            taking this action
          </Text>
          <Flex>
            <EditModal label="password" currentValue="" />
            <Button colorScheme={"red"} variant="outline">
              Delete Account
            </Button>
          </Flex>
        </Wrapper>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default withApollo({ ssr: false })(Settings);
