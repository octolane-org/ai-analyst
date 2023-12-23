/**
 * Download CSV file from data
 * @param headers - Headers of the CSV
 * @param data - Rows of the CSV
 * @param filename - Filename of the CSV to be downloaded
 * @example
 * // Download CSV file
 * downloadCSV(["Name", "Age"], ["One,23", "Rafi,24"], "octolane-founders.csv");
 */
export const downloadCSV = (
  headers: string[],
  data: string[],
  filename: string,
) => {
  const csvRows = [headers, ...data];

  const csvContent = csvRows.join("\n").replace(/(^\[)|(\]$)/gm, "");

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
