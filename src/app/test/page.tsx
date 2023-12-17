"use client";

import { ActionCard } from "@/components/ActionCard";
import Container from "@/components/Container";
import type { PersonCSVData } from "@/types/PersonEnrich.type";
import type { ChangeEventHandler } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { PersonTable } from "./components/PersonTable";

const SAFE_HEADERS = ["email", "Email", "EMAIL"];

export default function Home() {
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
      const jsonData = convertCSVToJson(csvData as string);
      if (!jsonData) {
        // clear the input
        inputEvent.target.value = "";
      }
      setPersonData(jsonData);
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between space-y-16 ">
      <Container>
        <div
          className={
            "my-12 flex flex-col items-center md:flex-row lg:my-16" +
            " mx-auto flex-1 justify-center  " +
            " duration-1000 slide-in-from-top-12" +
            "relative before:absolute before:inset-0 before:h-80 before:pointer-events-none before:bg-gradient-to-b before:from-zinc-100 before:-z-10"
          }
        >
          <div className="text-center ">
            <h1 className="font-inter-tight text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 via-zinc-900 to-zinc-900 pb-4">
              1-Click B2B Data Enrichment
            </h1>
            <p className="text-lg text-zinc-500 mb-2">
              Simply upload your file, and with one click and get the enriched
              data you need to drive your business forward.
            </p>
            <div className="pb-4">
              {" "}
              <span className={"text-xs text-gray-500 dark:text-gray-400 "}>
                No credit card required.
              </span>
            </div>
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

            {personData ? <PersonTable rowData={personData} /> : null}
          </div>
        </div>
      </Container>
    </div>
  );
}

const convertCSVToJson = (csvData: string): PersonCSVData[] | null => {
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");
  const result: PersonCSVData[] = [];

  if (
    !headers.some(header =>
      SAFE_HEADERS.includes(header.replace(/\\r/g, "").trim()),
    )
  ) {
    toast.error("No header detected as Email");
    return null;
  }

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      if (SAFE_HEADERS.includes(headers[j].replace(/\\r/g, "").trim())) {
        result.push({
          email: currentLine[j].trim(),
        });
      }
    }
  }

  return result;
};
