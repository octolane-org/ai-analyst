import fpJs from "@fingerprintjs/fingerprintjs";
import { useCallback } from "react";

export const useFingerprint = () => {
  const getFingerprint = useCallback(async () => {
    const fpLoad = fpJs.load().then(fp => fp.get());
    return (await fpLoad).visitorId;
  }, []);

  return { getFingerprint };
};
