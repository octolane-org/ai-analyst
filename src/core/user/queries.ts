import { FINGERPRINT_HEADER } from "@/constants/configs";
import { axios } from "@/lib/axios";
import { prisma } from "@/lib/prisma";
import type { APILimitResponse } from "@/types/api.type";

export const getEnrichmentLimitByFingerprint = async (fingerprint: string) => {
  return await axios.get<APILimitResponse>("/api/limit", {
    headers: { [FINGERPRINT_HEADER]: fingerprint },
  });
};

export const getUserByEmail = (email: string) => {
  return prisma.user.findFirst({
    where: { email },
    select: { fingerprint: true, enrichment_limit: true },
  });
};
