"use client";

import { ENRICHMENT_TYPE } from "@/constants/enrich.constants";
import { useEnrichContext } from "@/contexts/enrich-context";
import { Fragment } from "react";

import { CompanyTable } from "./CompanyTable";
import { PersonTable } from "./PersonTable";

export const EnrichTable = ({ csrfToken }: { csrfToken: string | null }) => {
  const { enrichmentType, personCSVData, companyCSVData } = useEnrichContext();

  return (
    <Fragment>
      {enrichmentType === ENRICHMENT_TYPE.PERSON && personCSVData ? (
        <PersonTable rowData={personCSVData} csrfToken={csrfToken} />
      ) : enrichmentType === ENRICHMENT_TYPE.COMPANY && companyCSVData ? (
        <CompanyTable rowData={companyCSVData} csrfToken={csrfToken} />
      ) : null}
    </Fragment>
  );
};
