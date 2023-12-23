"use client";

import type {
  CompanyCSVData,
  CompanyEnrichData,
} from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { createContext, useContext, useState } from "react";

type EnrichContextType = {
  enrichmentType: EnrichmentType | null;
  setEnrichmentType: (type: EnrichmentType) => void;

  companyCSVData: CompanyCSVData[] | null;
  setCompanyCSVData: (data: CompanyCSVData[] | null) => void;

  showDownloadButton: boolean;
  setShowDownloadButton: (show: boolean) => void;

  downloadableCompanyData: CompanyEnrichData[];
  setDownloadableCompanyData: (data: CompanyEnrichData[]) => void;
};

export const EnrichContext = createContext<EnrichContextType>({
  enrichmentType: null,
  setEnrichmentType: (type: EnrichmentType) => {},

  companyCSVData: null,
  setCompanyCSVData: (data: CompanyCSVData[] | null) => {},

  showDownloadButton: false,
  setShowDownloadButton: (show: boolean) => {},

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
  const [downloadableCompanyData, setDownloadableCompanyData] = useState<
    CompanyEnrichData[]
  >([]);
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

        downloadableCompanyData,
        setDownloadableCompanyData,

        companyCSVData,
        setCompanyCSVData,
      }}
    >
      {children}
    </EnrichContext.Provider>
  );
};
