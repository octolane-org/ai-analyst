import Container from "@/components/Container";
import { ENRICHMENT_TYPE } from "@/constants/enrich.constants";
import { EnrichContextProvider } from "@/contexts/enrich-context";
import { prisma } from "@/lib/prisma";
import { captureApiException } from "@/lib/sentry/sentry-browser";
import type {
  CompanyEnrichData,
  PersonEnrichData,
} from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { headers } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";

import { CSVUploaders } from "./components/CSVUploaders";
import { CompanyTable } from "./components/CompanyTable";
import { DownloadingData } from "./components/DownloadingData";

type SearchParams = {
  fp: string;
  action: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const csrfToken = headers().get("X-CSRF-Token");

  const getDownloadablePersonData = async () => {
    if (!searchParams.fp || !searchParams.action) return;

    try {
      const persons = await prisma.personForFingerprint.findMany({
        where: {
          fingerprint: searchParams.fp,
        },
        select: {
          person: {
            select: {
              full_name: true,
              email: true,
              job_title: true,
              linkedin_url: true,
              current_company: true,
              current_company_domain: true,
              email_verified: true,
              seniority: true,
              contact_number: true,
            },
          },
        },
      });

      return persons.map(
        ({ person }): PersonEnrichData => ({
          full_name: person.full_name ?? "",
          email: person.email,
          job_title: person.job_title ?? "",
          linkedin_url: person.linkedin_url ?? "",
          current_company: person.current_company ?? "",
          current_company_domain: person.current_company_domain ?? "",
          email_verified: person.email_verified ?? false,
          seniority: person.seniority ?? "",
          contact_number: person.contact_number ?? "",
        }),
      );
    } catch (error) {
      console.error(error);
      captureApiException(error, {
        context: "getDownloadablePersonData",
        searchParams,
      });
      return [];
    }
  };

  const getDownloadableCompanyData = async () => {
    if (!searchParams.fp || !searchParams.action) return;

    try {
      const company = await prisma.companyForFingerprint.findMany({
        where: {
          fingerprint: searchParams.fp,
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
        context: "getDownloadableCompanyData",
        searchParams,
      });
      return [];
    }
  };

  const downloadableData =
    searchParams.action === ENRICHMENT_TYPE.PERSON
      ? await getDownloadablePersonData()
      : searchParams.action === ENRICHMENT_TYPE.COMPANY
        ? await getDownloadableCompanyData()
        : [];

  return (
    <EnrichContextProvider>
      <div className="flex min-h-screen flex-col items-center justify-between space-y-16 ">
        <Container>
          <div
            className={
              "my-12 flex flex-col items-center md:flex-row lg:my-16" +
              " mx-auto flex-1 justify-center  " +
              " duration-1000 slide-in-from-top-12" +
              "relative before:absolute before:inset-0 before:h-80 before:pointer-events-none before:bg-gradient-to-b before:from-zinc-100 before:-z-10"
            }
          >
            <div className="text-center ">
              <h1 className="font-inter-tight text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 via-zinc-900 to-zinc-900 pb-4">
                1-Click LLM Powered B2B Data Analysis
              </h1>
              <p className="text-lg text-zinc-500 mb-2">
                Upload your file, and with one click and get the enriched data
                with detailed analysis
              </p>
              <div className="mb-3">
                <p className=" text-xl  font-sans">
                  Powered by
                  <Link href="https://metaphor.systems/">
                    {" "}
                    <span className="text-[#6e44ff] text-lg font-light font-sans">
                      {" "}
                      Metaphor AI
                    </span>
                  </Link>
                </p>
              </div>

              {downloadableData && downloadableData?.length > 0 ? (
                <DownloadingData
                  downloadableData={downloadableData}
                  downloadType={searchParams.action as EnrichmentType}
                />
              ) : (
                <Fragment>
                  {/* <span className={"text-xs text-gray-500 dark:text-gray-400"}>
                    {session.status === "unauthenticated" && showDownloadButton
                      ? "Work email required!"
                      : "No credit card required. Work email required!"}
                  </span> */}
                  <CompanyTable csrfToken={csrfToken} />
                  <CSVUploaders />
                </Fragment>
              )}
            </div>
          </div>
        </Container>
      </div>
    </EnrichContextProvider>
  );
}
