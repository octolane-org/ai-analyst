import { axios } from "@/lib/axios";
import { prisma } from "@/lib/prisma";

export const mapUserWithFingerprint = async (
  email: string,
  fingerprint: string,
) => {
  return await axios.post("/api/user", {
    email,
    fingerprint,
  });
};

export const updateUserFingerprint = (email: string, fingerprint: string) => {
  return prisma.user.update({
    where: { email },
    data: { fingerprint },
  });
};
