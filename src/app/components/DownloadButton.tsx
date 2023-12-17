"use client";

import { Button } from "@/components/ui/button";
import { useEnrichContext } from "@/contexts/enrich-context";

export const DownloadButton = () => {
  const { showDownloadButton } = useEnrichContext();

  return (
    <div className="pb-4 flex flex-col items-center gap-1">
      {showDownloadButton ? (
        <Button variant="cta">Download Enriched Data</Button>
      ) : null}
      <span className={"text-xs text-gray-500 dark:text-gray-400"}>
        No credit card required.
      </span>
    </div>
  );
};
