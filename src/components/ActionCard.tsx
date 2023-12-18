import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ENRICHMENT_TYPE,
  SAFE_COMPANY_HEADERS,
  SAFE_PERSON_HEADERS,
} from "@/constants/enrich.constants";
import { useEnrichContext } from "@/contexts/enrich-context";
import type { CompanyCSVData, PersonCSVData } from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { cn } from "@/utils/common";
import { convertCSVToJson } from "@/utils/csvToJson";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

type CardProps = React.ComponentProps<typeof Card> & {
  cardTitle: string;
  cardDescription: string;
  buttonText: string;
  type: EnrichmentType;
  onDataLoad: (
    inputEvent: ChangeEvent<HTMLInputElement>,
    type: EnrichmentType,
  ) => void;
};

export function ActionCard({
  className,
  cardTitle,
  cardDescription,
  buttonText,
  onDataLoad,
  type,
  ...props
}: CardProps) {
  const {
    setEnrichmentType,
    setShowDownloadButton,
    setPersonCSVData,
    setCompanyCSVData,
  } = useEnrichContext();
  const [shouldClickInput, setShouldClickInput] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Use an effect to click the input when shouldClickInput is true
  useEffect(() => {
    if (shouldClickInput && inputRef.current) {
      inputRef.current.click();
      setShouldClickInput(false);
    }
  }, [shouldClickInput]);

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
        setPersonCSVData(jsonData);
      } else {
        const jsonData = convertCSVToJson<CompanyCSVData>(
          csvData as string,
          SAFE_COMPANY_HEADERS,
          "domain",
        );
        if (!jsonData) {
          inputEvent.target.value = "";
        }
        setCompanyCSVData(jsonData);
      }
    };

    reader.readAsText(file);
  };

  const onClick = () => {
    setEnrichmentType(type);
    setShouldClickInput(true);
  };

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <input
        type="file"
        accept=".csv,.xlxs"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={fileEvent => {
          if (fileEvent.target !== null) handleCSVInputChange(fileEvent, type);
        }}
      />
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Button className="w-full" onClick={onClick}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
