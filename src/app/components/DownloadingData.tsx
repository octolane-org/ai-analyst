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
        downloadableData,
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
