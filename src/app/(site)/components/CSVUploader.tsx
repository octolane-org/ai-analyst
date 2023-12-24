"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { SAFE_COMPANY_HEADERS } from "@/constants/enrich.constants";
import { SAMPLE_CSV_DATA } from "@/constants/sample-csv-data.constant";
import { useEnrichContext } from "@/contexts/enrich-context";
import type { CompanyCSVData } from "@/types/PersonEnrich.type";
import { cn } from "@/utils/common";
import { convertCSVToJson } from "@/utils/csvToJson";
import { downloadCSV } from "@/utils/downloadCSV";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import type { ChangeEvent } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CSVUploader = () => {
  const {
    setShowDownloadButton,
    companyCSVData,
    setCompanyCSVData,
    setEnrichmentType,
  } = useEnrichContext();
  const session = useSession();

  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldClickInput, setShouldClickInput] = useState(false);

  useEffect(() => {
    if (shouldClickInput && inputRef.current) {
      inputRef.current.click();
      setShouldClickInput(false);
    }
  }, [shouldClickInput]);

  const handleCSVInputChange = (inputEvent: ChangeEvent<HTMLInputElement>) => {
    if (!inputEvent.target.files || inputEvent.target.files.length === 0)
      return;

    const file = inputEvent.target.files[0];
    const reader = new FileReader();

    setShowDownloadButton(false);

    reader.onload = fileEvent => {
      const csvData = fileEvent.target?.result;

      console.log(csvData);

      const jsonData = convertCSVToJson<CompanyCSVData>(
        csvData as string,
        SAFE_COMPANY_HEADERS,
        "domain",
      );
      if (!jsonData) {
        inputEvent.target.value = "";
      }
      if (jsonData ? jsonData?.length > 500 : false) {
        toast.error("You can only upload up to 500 people at a time.");
        inputEvent.target.value = "";
        return;
      }
      setCompanyCSVData(jsonData || []);
    };

    reader.readAsText(file);
  };

  const onClick = () => {
    setEnrichmentType("company");
    setShouldClickInput(true);
    posthog.capture(
      POSTHOG_EVENTS.ENRICH_COMPANY,
      session.status === "authenticated"
        ? { email: session.data.user?.email }
        : {},
    );
  };

  const downloadSampleCSV = () => {
    downloadCSV(["domain"], SAMPLE_CSV_DATA, "sample-company-csv.csv");
  };

  return (
    <Fragment>
      {!companyCSVData ? (
        <div className="flex space-x-5 pb-5 justify-center">
          <Card className={cn("w-[380px]")}>
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              ref={inputRef}
              onChange={handleCSVInputChange}
            />
            <CardHeader>
              <CardTitle>Enrich Company</CardTitle>
              <CardDescription>
                Upload a CSV or Excel of up to 500 company website and enrich
                information for free..
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex flex-col items-center gap-2">
              <Button className="w-full" onClick={onClick}>
                Upload CSV
              </Button>

              <p
                className="text-xs text-muted-foreground cursor-pointer"
                onClick={downloadSampleCSV}
              >
                Download sample CSV
              </p>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </Fragment>
  );
};

export default CSVUploader;
