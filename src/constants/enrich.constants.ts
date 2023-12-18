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
  "Email Verified",
  "LinkedIn URL",
  "Contact Number",
  "Job Title",
  "Seniority",
  "Current Company",
  "Current Company Domain",
];

export const COMPANY_ENRICHED_CSV_HEADERS = [
  "Name",
  "Email",
  "Email Verified",
  "LinkedIn URL",
  "Contact Number",
  "Job Title",
  "Seniority",
  "Current Company",
  "Current Company Domain",
];
