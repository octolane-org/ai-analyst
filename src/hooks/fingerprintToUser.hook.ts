import { mapUserWithFingerprint } from "@/core/user/mutations";
import { clearURLSearchParams } from "@/utils/common";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

/**
 * This hook is used to map the fingerprint to the user.
 */
export const useFingerprintToUserMap = () => {
  // Get the fingerprint from the URL params as "fp"
  const searchParams = useSearchParams();
  const fingerprint = searchParams.get("fp");

  const session = useSession();

  const mappedUser = useCallback(mapUserWithFingerprint, []);

  useEffect(() => {
    if (
      fingerprint &&
      session.status === "authenticated" &&
      session.data.user
    ) {
      mapUserWithFingerprint(session.data.user.email as string, fingerprint);
    }
    clearURLSearchParams();
  }, [fingerprint, session, mappedUser]);
};
