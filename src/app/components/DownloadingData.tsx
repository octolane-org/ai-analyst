"use client";

import {
  COMPANY_ENRICHED_CSV_HEADERS,
  PERSON_ENRICHED_CSV_HEADERS,
} from "@/constants/enrich.constants";
import type {
  CompanyEnrichData,
  PersonEnrichData,
} from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { clearURLSearchParams } from "@/utils/common";
import { jsonToCSV } from "@/utils/jsonToCSV";
import { useCallback, useEffect, useState } from "react";

export const DownloadingData = ({
  downloadableData,
  downloadType = "person",
}: {
  downloadableData: PersonEnrichData[] | CompanyEnrichData[];
  downloadType: EnrichmentType;
}) => {
  const [downloading, setDownloading] = useState(false);

  const downloadDataAsCSV = useCallback(
    async (downloadType: EnrichmentType) => {
      setDownloading(true);

      jsonToCSV(
        downloadType === "person"
          ? PERSON_ENRICHED_CSV_HEADERS
          : COMPANY_ENRICHED_CSV_HEADERS,
        downloadType === "person"
          ? (downloadableData as PersonEnrichData[]).map(
              person =>
                `"${person.full_name ?? ""}","${person.email}","${
                  person.job_title ?? ""
                }","${person.linkedin_url ?? ""}","${
                  person.current_company ?? ""
                }","${person.current_company_domain ?? ""}","${
                  person.email_verified ?? ""
                }","${person.seniority ?? ""}","${
                  person.contact_number ?? ""
                }"`,
            )
          : (downloadableData as CompanyEnrichData[]).map(
              company =>
                `"${company.company_name ?? ""}","${company.domain}","${
                  `https://linkedin.com/${company.linkedin_url}` ?? ""
                }","${company.employee_size_range ?? ""}","${
                  company.estimated_annual_revenue ?? ""
                }","${company.twitter_url ?? ""}","${
                  company.twitter_followers ?? ""
                }","${company.primary_location ?? ""}","${
                  company.founded_at ?? ""
                }","${company.industry ?? ""}"`,
            ),
        `octolane-${downloadType}-enrichment.csv`,
      );

      setDownloading(false);
      clearURLSearchParams();
    },
    [downloadableData],
  );

  useEffect(() => {
    downloadDataAsCSV(downloadType);
  }, [downloadType, downloadDataAsCSV]);

  return (
    <div>
      <h2 className="text-2xl font-bold">
        {downloading ? "Downloading Data..." : "Downloaded Data"}
      </h2>
    </div>
  );
};
