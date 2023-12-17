import type { PersonEnrichData } from "@/types/PersonEnrich.type";

export const jsonToCSV = (
  headers: string[],
  json: PersonEnrichData[],
  filename: string,
) => {
  const csvRows = [headers, ...json.map(row => Object.values(row))];

  const csvContent = csvRows
    .map(row => row.join(","))
    .join("\n")
    .replace(/(^\[)|(\]$)/gm, "");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
