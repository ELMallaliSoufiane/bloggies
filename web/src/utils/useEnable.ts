import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useEnable = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me?.active) {
      router.push("/settings?enabledialog=true");
    }
  }, [router, data, loading]);
};
