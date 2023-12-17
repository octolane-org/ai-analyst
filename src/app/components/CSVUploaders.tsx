"use client";

import { ActionCard } from "@/components/ActionCard";
import type { PersonCSVData } from "@/types/PersonEnrich.type";
import { convertCSVToJson } from "@/utils/csvToJson";
import { Fragment, useState, type ChangeEventHandler } from "react";

import { PersonTable } from "./PersonTable";

const SAFE_HEADERS = ["email", "Email", "EMAIL"];

export const CSVUploaders = ({ csrfToken }: { csrfToken: string | null }) => {
  const [personData, setPersonData] = useState<PersonCSVData[] | null>(null);

  const handleCSVInputChange: ChangeEventHandler<
    HTMLInputElement
  > = inputEvent => {
    if (!inputEvent.target.files || inputEvent.target.files.length === 0)
      return;

    const file = inputEvent.target.files[0];
    const reader = new FileReader();

    reader.onload = fileEvent => {
      const csvData = fileEvent.target?.result;
      const jsonData = convertCSVToJson<PersonCSVData>(
        csvData as string,
        SAFE_HEADERS,
        "email",
      );
      if (!jsonData) {
        inputEvent.target.value = "";
      }
      setPersonData(jsonData);
    };

    reader.readAsText(file);
  };

  return (
    <Fragment>
      {personData ? (
        <PersonTable rowData={personData} csrfToken={csrfToken} />
      ) : (
        <div className="flex space-x-5 pb-5">
          <ActionCard
            cardTitle="Enrich People"
            cardDescription="Upload a CSV or Excel of up to 500 people email and enrich their information for free."
            buttonText="Upload CSV"
            onDataLoad={handleCSVInputChange}
          />

          <ActionCard
            cardTitle="Enrich Company"
            cardDescription="Upload a CSV or Excel of up to 500 company website and enrich information for free.."
            buttonText="Upload CSV"
            onDataLoad={handleCSVInputChange}
          />
        </div>
      )}
    </Fragment>
  );
};
