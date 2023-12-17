"use client";

import type { PersonEnrichData } from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { createContext, useContext, useState } from "react";

type EnrichContextType = {
  enrichmentType: EnrichmentType;
  setEnrichmentType: (type: EnrichmentType) => void;

  showDownloadButton: boolean;
  setShowDownloadButton: (show: boolean) => void;

  downloadablePersonData: PersonEnrichData[];
  setDownloadablePersonData: (data: PersonEnrichData[]) => void;
};

export const EnrichContext = createContext<EnrichContextType>({
  enrichmentType: "person",
  setEnrichmentType: (type: EnrichmentType) => {},

  showDownloadButton: false,
  setShowDownloadButton: (show: boolean) => {},

  downloadablePersonData: [],
  setDownloadablePersonData: (data: PersonEnrichData[]) => {},
});

export const useEnrichContext = () => useContext(EnrichContext);

export const EnrichContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [enrichmentType, setEnrichmentType] =
    useState<EnrichmentType>("person");
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [downloadablePersonData, setDownloadablePersonData] = useState<
    PersonEnrichData[]
  >([]);

  return (
    <EnrichContext.Provider
      value={{
        enrichmentType,
        setEnrichmentType,
        showDownloadButton,
        setShowDownloadButton,
        downloadablePersonData,
        setDownloadablePersonData,
      }}
    >
      {children}
    </EnrichContext.Provider>
  );
};
