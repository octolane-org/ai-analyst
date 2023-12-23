export const ENRICHMENT_TYPE = {
  COMPANY: "company",
} as const;

export const SAFE_COMPANY_HEADERS = [
  "domain",
  "Domain",
  "DOMAIN",
  "website",
  "Website",
  "WEBSITE",
];

export const COMPANY_ENRICHED_CSV_HEADERS = [
  "Company Name",
  "Domain",
  "LinkedIn URL",
  "Est. Employee Size",
  "Est. Annual Revenue",
  "Twitter URL",
  "Twitter Followers",
  "Primary Location",
  "Founded At",
  "Industry",
];
