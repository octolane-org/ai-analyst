import { axios } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export const useFingerprintToUserMap = () => {
  // Get the fingerprint from the URL params as "fp"
  const searchParams = useSearchParams();
  const fingerprint = searchParams.get("fp");

  const session = useSession();

  const clearFingerprint = () => {
    // clear the fingerprint from the URL
    window.history.replaceState({}, "", "/");
  };

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
    console.log(fingerprint, session);

    if (
      fingerprint &&
      session.status === "authenticated" &&
      session.data.user
    ) {
      mapUserWithFingerprint(session.data.user.email as string, fingerprint);
    }
    clearFingerprint();
  }, [fingerprint, session, mapUserWithFingerprint]);
};
