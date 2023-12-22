import { toast } from "sonner";

export const convertCSVToJson = <T = Record<string, any>>(
  csvData: string,
  safeHeaders: string[],
  mandatoryField: string,
): T[] | null => {
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");
  const result: Record<string, any>[] = [];

  if (
    !headers.some(header =>
      safeHeaders.includes(header.replace(/\\r/g, "").trim()),
    )
  ) {
    toast.error(`No header detected as ${mandatoryField}`);
    return null;
  }

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      if (safeHeaders.includes(headers[j].replace(/\\r/g, "").trim())) {
        result.push({
          [mandatoryField]: currentLine[j].trim(),
        });
      }
    }
  }

  return result as T[];
};
