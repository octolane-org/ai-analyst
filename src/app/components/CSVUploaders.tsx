"use client";

import { ActionCard } from "@/components/ActionCard";
import {
  ENRICHMENT_TYPE,
  SAFE_COMPANY_HEADERS,
  SAFE_PERSON_HEADERS,
} from "@/constants/enrich.constants";
import { useEnrichContext } from "@/contexts/enrich-context";
import type { CompanyCSVData, PersonCSVData } from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { convertCSVToJson } from "@/utils/csvToJson";
import type { ChangeEvent } from "react";
import { Fragment } from "react";

export const CSVUploaders = () => {
  const {
    setShowDownloadButton,
    personCSVData,
    companyCSVData,
    setPersonCSVData,
    setCompanyCSVData,
  } = useEnrichContext();

  const handleCSVInputChange = (
    inputEvent: ChangeEvent<HTMLInputElement>,
    type: EnrichmentType,
  ) => {
    if (!inputEvent.target.files || inputEvent.target.files.length === 0)
      return;

    const file = inputEvent.target.files[0];
    const reader = new FileReader();

    setShowDownloadButton(false);

    reader.onload = fileEvent => {
      const csvData = fileEvent.target?.result;

      if (type === ENRICHMENT_TYPE.PERSON) {
        const jsonData = convertCSVToJson<PersonCSVData>(
          csvData as string,
          SAFE_PERSON_HEADERS,
          "email",
        );
        if (!jsonData) {
          inputEvent.target.value = "";
        }
        setPersonCSVData(jsonData || []);
      } else {
        const jsonData = convertCSVToJson<CompanyCSVData>(
          csvData as string,
          SAFE_COMPANY_HEADERS,
          "domain",
        );
        if (!jsonData) {
          inputEvent.target.value = "";
        }
        setCompanyCSVData(jsonData || []);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Fragment>
      {!personCSVData && !companyCSVData ? (
        <div className="flex space-x-5 pb-5">
          <ActionCard
            cardTitle="Enrich People"
            cardDescription="Upload a CSV or Excel of up to 500 people email and enrich their information for free."
            buttonText="Upload CSV"
            type={ENRICHMENT_TYPE.PERSON}
            onDataLoad={handleCSVInputChange}
          />

          <ActionCard
            cardTitle="Enrich Company"
            cardDescription="Upload a CSV or Excel of up to 500 company website and enrich information for free.."
            buttonText="Upload CSV"
            type={ENRICHMENT_TYPE.COMPANY}
            onDataLoad={handleCSVInputChange}
          />
        </div>
      ) : null}
    </Fragment>
  );
};
