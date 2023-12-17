import Container from "@/components/Container";
import { EnrichContextProvider } from "@/contexts/enrich-context";
import { prisma } from "@/lib/prisma";
import type { PersonEnrichData } from "@/types/PersonEnrich.type";
import { headers } from "next/headers";
import { Fragment } from "react";

import { CSVUploaders } from "./components/CSVUploaders";
import { DownloadButton } from "./components/DownloadButton";
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

  const getDownloadableData = async () => {
    if (!searchParams.fp || !searchParams.action) return;

    try {
      const persons = await prisma.personForFingerprint.findMany({
        where: {
          fingerprint: searchParams.fp,
        },
        select: {
          person: {
            select: {
              email: true,
              full_name: true,
              job_title: true,
              last_name: true,
              seniority: true,
              first_name: true,
              linkedin_url: true,
              email_verified: true,
              contact_number: true,
              current_company: true,
              current_company_domain: true,
            },
          },
        },
      });

      return persons.map(person => person.person) as PersonEnrichData[];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const downloadablePersonData = await getDownloadableData();

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
                1-Click B2B Data Enrichment
              </h1>
              <p className="text-lg text-zinc-500 mb-2">
                Simply upload your file, and with one click and get the enriched
                data you need to drive your business forward.
              </p>

              {downloadablePersonData && downloadablePersonData?.length > 0 ? (
                <DownloadingData downloadableData={downloadablePersonData} />
              ) : (
                <Fragment>
                  <DownloadButton />
                  <CSVUploaders csrfToken={csrfToken} />
                </Fragment>
              )}
            </div>
          </div>
        </Container>
      </div>
    </EnrichContextProvider>
  );
}
