export type PersonCSVData = {
  email: string;
};

export type PersonEnrichData = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email: string;
  linkedin_url?: string;
  email_verified?: boolean;
  contact_number?: string;
  job_title?: string;
  seniority?: string;
  current_company?: string;
  current_company_domain?: string;
};
