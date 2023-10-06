// Download CSV
import { convertToCSV } from "./convertToCSV";

export const downloadCSV = (data) => {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "spreadsheet_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
