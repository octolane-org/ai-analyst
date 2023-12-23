import { FINGERPRINT_HEADER, configuration } from "@/constants/configs";
import { axios } from "@/lib/axios";
import { prisma } from "@/lib/prisma";
import type {
  CompanyCSVData,
  CompanyEnrichData,
} from "@/types/PersonEnrich.type";
import { getRootDomain } from "@/utils/getRootDomain";

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

export const getCompanyEnrichmentFromOctolane = async (domain: string) => {
  return await axios.post<{
    data: Omit<CompanyEnrichData, "founded_at">;
  }>(
    "https://enrich.octolane.com/v1/company",
    { domain: getRootDomain(domain) },
    { headers: { "x-api-key": configuration.octolaneAPIKey } },
  );
};

export const saveCompanrEnrichmentDataToDBByFingerprint = async (
  data: CompanyCSVData,
  fingerprint: string,
) => {
  prisma.$transaction(async trx => {
    const company = await trx.companyEnrichment.upsert({
      where: { domain: data.domain },
      create: data,
      update: data,
    });

    const companyForFingerprint = await trx.companyForFingerprint.findFirst({
      where: { fingerprint, companyId: company.id },
    });

    if (!companyForFingerprint) {
      await trx.companyForFingerprint.create({
        data: {
          fingerprint,
          companyId: company.id,
        },
      });
    }
  });
};
