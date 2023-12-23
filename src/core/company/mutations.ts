import { FINGERPRINT_HEADER } from "@/constants/configs";
import { axios } from "@/lib/axios";
import type { CompanyEnrichData } from "@/types/PersonEnrich.type";

export const enrichCompanyByDomain = async ({
  fingerprint,
  csrfToken,
  domain,
}: {
  fingerprint: string;
  csrfToken: string;
  domain: string;
}) => {
  return await axios.post<CompanyEnrichData>(
    "/api/company",
    { domain },
    {
      headers: {
        "X-CSRF-Token": csrfToken,
        "x-fingerprint": fingerprint,
      },
      timeout: 20000,
    },
  );
};

export const aiAnalyzeForCompanyDomain = async (
  fingerprint: string,
  domain: string,
) => {
  const { body } = await fetch("/api/ai-analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [FINGERPRINT_HEADER]: fingerprint,
    },
    body: JSON.stringify({ domain }),
  });

  return body?.getReader();
};
