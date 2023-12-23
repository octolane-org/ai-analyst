import { FINGERPRINT_HEADER } from "@/constants/configs";
import { axios } from "@/lib/axios";
import type { APILimitResponse } from "@/types/api.type";

export const getEnrichmentLimitByFingerprint = async (fingerprint: string) => {
  return await axios.get<APILimitResponse>("/api/limit", {
    headers: { [FINGERPRINT_HEADER]: fingerprint },
  });
};
