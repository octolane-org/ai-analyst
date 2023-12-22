export const ENRICHMENT_TYPE = {
  PERSON: "person",
  COMPANY: "company",
} as const;

export const SAFE_PERSON_HEADERS = ["email", "Email", "EMAIL"];
export const SAFE_COMPANY_HEADERS = [
  "domain",
  "Domain",
  "DOMAIN",
  "website",
  "Website",
  "WEBSITE",
];

export const PERSON_ENRICHED_CSV_HEADERS = [
  "Name",
  "Email",
  "Job Title",
  "LinkedIn URL",
  "Current Company",
  "Current Company Domain",
  "Email Verified",
  "Seniority",
  "Contact Number",
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
