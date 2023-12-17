import { axios } from "@/lib/axios";
import { clearURLSearchParams } from "@/utils/common";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export const useFingerprintToUserMap = () => {
  // Get the fingerprint from the URL params as "fp"
  const searchParams = useSearchParams();
  const fingerprint = searchParams.get("fp");

  const session = useSession();

  const mapUserWithFingerprint = useCallback(
    async (email: string, fp: string) => {
      await axios.post("/api/user", {
        email,
        fingerprint: fp,
      });
    },
    [],
  );

  useEffect(() => {
    if (
      fingerprint &&
      session.status === "authenticated" &&
      session.data.user
    ) {
      mapUserWithFingerprint(session.data.user.email as string, fingerprint);
    }
    clearURLSearchParams();
  }, [fingerprint, session, mapUserWithFingerprint]);
};
