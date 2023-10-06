// Convert Data Array Format to CSV
export const convertToCSV = (data) => {
  try {
    const formattedData = data.map((row) =>
      row.map((cell) => (cell ? cell.value : ""))
    );

    // Create arrays to hold non-empty rows and columns
    const nonEmptyRows = [];
    const nonEmptyColumns = Array.from(
      { length: formattedData[0]?.length },
      () => []
    );

    // Populate non-empty rows and columns
    formattedData.forEach((row, rowIndex) => {
      const nonEmptyRow = row.filter((value) => value !== "");
      nonEmptyRows.push(nonEmptyRow);

      row.forEach((value, colIndex) => {
        if (value !== "") {
          nonEmptyColumns[colIndex].push(value);
        }
      });
    });

    // Filter out undefined columns and rows
    const filteredNonEmptyRows = nonEmptyRows.filter((row) => row.length > 0);

    // Create CSV string using join
    const csvData = filteredNonEmptyRows.map((row) => row.join(",")).join("\n");

    return csvData;
  } catch (error) {
    console.error("Error converting to CSV:", error);
    return "";
  }
};
