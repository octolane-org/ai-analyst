import Container from "@/components/Container";
import { X_CSRF_TOKEN_HEADER } from "@/constants/configs";
import { ENRICHMENT_TYPE } from "@/constants/enrich.constants";
import { EnrichContextProvider } from "@/contexts/enrich-context";
import { getCompanyDataByFingerprint } from "@/core/company/queries";
import type { EnrichmentType } from "@/types/app.type";
import type { ServerPageProps } from "@/types/common.type";
import { headers } from "next/headers";
import { Fragment } from "react";

import CSVUploader from "./components/CSVUploader";
import { CompanyTable } from "./components/CompanyTable";
import { DownloadingData } from "./components/DownloadingData";

type SearchParams = {
  fp: string;
  action: string;
};

export default async function Home({
  searchParams,
}: ServerPageProps<any, SearchParams>) {
  const csrfToken = headers().get(X_CSRF_TOKEN_HEADER);

  const downloadableData =
    searchParams.action === ENRICHMENT_TYPE.COMPANY
      ? await getCompanyDataByFingerprint(searchParams.fp)
      : null;

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
                1-Click AI Analyst
              </h1>
              <p className="text-lg text-zinc-500 mb-2">
                Upload your file, and with one click and get the enriched data
                with detailed analysis
              </p>

              {downloadableData && downloadableData?.length > 0 ? (
                <DownloadingData
                  downloadableData={downloadableData}
                  downloadType={searchParams.action as EnrichmentType}
                />
              ) : (
                <Fragment>
                  <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                    No credit card required. Work email required!
                  </p>
                  <CompanyTable csrfToken={csrfToken} />
                  <CSVUploader />
                </Fragment>
              )}
            </div>
          </div>
        </Container>
      </div>
    </EnrichContextProvider>
  );
}
