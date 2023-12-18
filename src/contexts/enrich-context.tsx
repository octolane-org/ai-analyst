"use client";

import type {
  CompanyCSVData,
  CompanyEnrichData,
  PersonCSVData,
  PersonEnrichData,
} from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { createContext, useContext, useState } from "react";

type EnrichContextType = {
  enrichmentType: EnrichmentType | null;
  setEnrichmentType: (type: EnrichmentType) => void;

  personCSVData: PersonCSVData[] | null;
  setPersonCSVData: (data: PersonCSVData[] | null) => void;

  companyCSVData: CompanyCSVData[] | null;
  setCompanyCSVData: (data: CompanyCSVData[] | null) => void;

  showDownloadButton: boolean;
  setShowDownloadButton: (show: boolean) => void;

  downloadablePersonData: PersonEnrichData[];
  setDownloadablePersonData: (data: PersonEnrichData[]) => void;

  downloadableCompanyData: CompanyEnrichData[];
  setDownloadableCompanyData: (data: CompanyEnrichData[]) => void;
};

export const EnrichContext = createContext<EnrichContextType>({
  enrichmentType: null,
  setEnrichmentType: (type: EnrichmentType) => {},

  personCSVData: null,
  setPersonCSVData: (data: PersonCSVData[] | null) => {},

  companyCSVData: null,
  setCompanyCSVData: (data: CompanyCSVData[] | null) => {},

  showDownloadButton: false,
  setShowDownloadButton: (show: boolean) => {},

  downloadablePersonData: [],
  setDownloadablePersonData: (data: PersonEnrichData[]) => {},

  downloadableCompanyData: [],
  setDownloadableCompanyData: (data: CompanyEnrichData[]) => {},
});

export const useEnrichContext = () => useContext(EnrichContext);

export const EnrichContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [enrichmentType, setEnrichmentType] = useState<EnrichmentType | null>(
    null,
  );
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [downloadablePersonData, setDownloadablePersonData] = useState<
    PersonEnrichData[]
  >([]);
  const [downloadableCompanyData, setDownloadableCompanyData] = useState<
    CompanyEnrichData[]
  >([]);
  const [personCSVData, setPersonCSVData] = useState<PersonCSVData[] | null>(
    null,
  );
  const [companyCSVData, setCompanyCSVData] = useState<CompanyCSVData[] | null>(
    null,
  );

  return (
    <EnrichContext.Provider
      value={{
        enrichmentType,
        setEnrichmentType,
        showDownloadButton,
        setShowDownloadButton,

        downloadablePersonData,
        setDownloadablePersonData,
        downloadableCompanyData,
        setDownloadableCompanyData,

        personCSVData,
        setPersonCSVData,
        companyCSVData,
        setCompanyCSVData,
      }}
    >
      {children}
    </EnrichContext.Provider>
  );
};
