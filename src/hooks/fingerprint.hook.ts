import fpJs from "@fingerprintjs/fingerprintjs";
import { useCallback } from "react";

/**
 * This hook is used to get the fingerprint.
 * @returns Returns a function that returns the fingerprint.
 * @example
 * // Initialize the hook
 * const { getFingerprint } = useFingerprint();
 * // Get the fingerprint
 * const fingerprint = await getFingerprint();
 */
export const useFingerprint = () => {
  const getFingerprint = useCallback(async () => {
    const fpLoad = fpJs.load().then(fp => fp.get());
    return (await fpLoad).visitorId;
  }, []);

  return { getFingerprint };
};
