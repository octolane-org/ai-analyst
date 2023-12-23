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
