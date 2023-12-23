import { prisma } from "@/lib/prisma";
import { captureApiException } from "@/lib/sentry/sentry-browser";
import type { CompanyEnrichData } from "@/types/PersonEnrich.type";

export const getCompanyDataByFingerprint = async (fingerprint: string) => {
  if (!fingerprint) return;

  try {
    const company = await prisma.companyForFingerprint.findMany({
      where: {
        fingerprint,
      },
      select: {
        company: {
          select: {
            company_name: true,
            domain: true,
            linkedin_url: true,
            employee_size_range: true,
            estimated_annual_revenue: true,
            twitter_url: true,
            twitter_followers: true,
            primary_location: true,
            founded_at: true,
            industry: true,
          },
        },
      },
    });

    return company.map(
      ({ company }): CompanyEnrichData => ({
        company_name: company.company_name ?? "",
        domain: company.domain ?? "",
        linkedin_url: company.linkedin_url ?? "",
        employee_size_range: company.employee_size_range ?? "",
        estimated_annual_revenue: company.estimated_annual_revenue ?? "",
        twitter_url: company.twitter_url ?? "",
        twitter_followers: company.twitter_followers ?? "",
        primary_location: company.primary_location ?? "",
        founded_at: company.founded_at ?? "",
        industry: company.industry ?? "",
        // tags: company.tags ? JSON.parse(company.tags as string) : "",
      }),
    );
  } catch (error) {
    console.error(error);
    captureApiException(error, {
      context: "getCompanyDataByFingerprint",
      fingerprint,
    });
    return [];
  }
};

export const getCompanyEnrichmentCountByFingerprint = (fingerprint: string) => {
  return prisma.companyForFingerprint.count({
    where: { fingerprint },
  });
};
