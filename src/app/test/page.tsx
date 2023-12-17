"use client";

import type { ChangeEventHandler } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { CsvUploader } from "./components/CsvUploader";

const SAFE_HEADERS = ["email", "Email", "EMAIL"];

const convertCSVToJson = (csvData: string) => {
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");
  const result = [];

  if (
    !headers.some(header =>
      SAFE_HEADERS.includes(header.replace(/\\r/g, "").trim()),
    )
  ) {
    toast.error("No header detected as Email");
    return null;
  }

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, any> = {};
    const currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      if (SAFE_HEADERS.includes(headers[j].replace(/\\r/g, "").trim())) {
        obj["email"] = currentLine[j].trim();
      }
    }

    result.push(obj);
  }

  return result;
};

export default function Home() {
  const [personData, setPersonData] = useState<Record<string, any>[] | null>(
    null,
  );

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CsvUploader
        title="Upload Person CSV"
        onDataLoad={handleCSVInputChange}
      />

      {personData ? (
        <div className="json-container">
          <pre>{JSON.stringify(personData, null, 2)}</pre>
        </div>
      ) : null}
    </main>
  );
}
