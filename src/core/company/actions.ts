import type { CompanyEnrichData } from "@/types/PersonEnrich.type";

export const convertCompanyDataForCSV = (companyData: CompanyEnrichData[]) => {
  return companyData.map(
    company =>
      `"${company.company_name ?? ""}","${company.domain}","${
        company.linkedin_url
          ? `https://linkedin.com/${company.linkedin_url}`
          : ""
      }","${company.employee_size_range ?? ""}","${
        company.estimated_annual_revenue ?? ""
      }","${company.twitter_url ?? ""}","${company.twitter_followers ?? ""}","${
        company.primary_location ?? ""
      }","${company.founded_at ?? ""}","${company.industry ?? ""}"`,
  );
};
