import { axios } from "@/lib/axios";

export const mapUserWithFingerprint = async (
  email: string,
  fingerprint: string,
) => {
  return await axios.post("/api/user", {
    email,
    fingerprint,
  });
};
