"use client";

import { createContext, useContext, useState } from "react";

export const EnrichContext = createContext({
  showDownloadButton: false,
  setShowDownloadButton: (show: boolean) => {},
});

export const useEnrichContext = () => useContext(EnrichContext);

export const EnrichContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  return (
    <EnrichContext.Provider
      value={{ showDownloadButton, setShowDownloadButton }}
    >
      {children}
    </EnrichContext.Provider>
  );
};
