"use client";

import type { PersonEnrichData } from "@/types/PersonEnrich.type";
import { clearURLSearchParams } from "@/utils/common";
import { useCallback, useEffect, useState } from "react";

export const DownloadingData = ({
  downloadableData,
}: {
  downloadableData: PersonEnrichData[];
}) => {
  const [downloading, setDownloading] = useState(false);

  const downloadDataAsCSV = useCallback(async () => {
    setDownloading(true);

    const csvRows = [
      [
        "Name",
        "Email",
        "Email Verified",
        "LinkedIn URL",
        "Contact Number",
        "Job Title",
        "Seniority",
        "Current Company",
        "Current Company Domain",
      ],
      ...downloadableData.map(person => [
        person.full_name,
        person.email,
        person.email_verified,
        person.linkedin_url,
        person.contact_number,
        person.job_title,
        person.seniority,
        person.current_company,
        person.current_company_domain,
      ]),
    ];

    const csvContent = csvRows
      .map(row => row.join(","))
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
    clearURLSearchParams();
  }, [downloadableData]);

  useEffect(() => {
    downloadDataAsCSV();
  }, [downloadDataAsCSV]);

  return (
    <div>
      <h2 className="text-2xl font-bold">
        {downloading ? "Downloading Data..." : "Downloaded Data"}
      </h2>
    </div>
  );
};
