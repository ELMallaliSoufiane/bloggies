import Navbar from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { urqlClient } from "../utils/urqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <div>body</div>
      {fetching ? (
        <div>loading...</div>
      ) : (
        data?.posts.map((p) => <div>{p.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(urqlClient, { ssr: true })(Index);
