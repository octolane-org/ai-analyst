export type PersonCSVData = {
  email: string;
};

export type CompanyCSVData = {
  domain: string;
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

export type CompanyEnrichData = {
  domain: string;
  company_name?: string;
  industry?: string;
  founded_at?: string;
  primary_location?: string;
  linkedin_url?: string;
  twitter_url?: string;
  twitter_followers?: string;
  estimated_annual_revenue?: string;
  employee_size_range?: string;
  tags?: string[];
};
