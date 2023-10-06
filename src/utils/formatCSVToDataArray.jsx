import Papa from "papaparse";
export const formatCSVToDataArray = (csv) => {
  console.time("CSV Conversion Data");

  const parsedData = Papa.parse(csv, {
    skipEmptyLines: true
  });

  if (parsedData.errors.length > 0) {
    console.error("Error parsing CSV:", parsedData.errors);
    return null;
  }

  const data = parsedData.data.map((row) => {
    return row.map((cell) => ({ value: cell }));
  });

  console.timeEnd("CSV Conversion Data");
  return { parsedData, data };
};
