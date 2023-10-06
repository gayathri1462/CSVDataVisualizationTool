import React, { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import { Radio } from "antd";
import { useSelector } from "react-redux";
import styles from "./Dashboard.module.scss";
import { getUniqueKeys, getProcessedStackBarData } from "../../utils/index";
import DropdownButton from "../../components/dropdownBtn/DropDown";
import StackedBarChart from "../../components/stackedBarChart/StackedBarChart";
import BarChart from "../../components/barChart/BarChart";
import LineChart from "../../components/lineChart/LineChart";
import DoughNutChart from "../../components/donutChart/DonutChart";

const ChartComponent = () => {
  const csvOptions = [
    { label: "Row", value: "Row" },
    { label: "Column", value: "Column" }
  ];

  const chartTypeOptions = [
    { label: "Bar Chart", value: "Bar Chart" },
    { label: "Line Chart", value: "Line Chart" },
    { label: "Donut Chart", value: "Donut Chart" }
  ];

  const csvData = useSelector((state) => state?.csvInfo?.csvData);

  // const rowCsvData = `Customer Unique ID,Mobile Number,Loan Type,Flow Type
  // 21561GDSHDJD,+91 998765432,Car Loan,Pre Due
  // 21562ABCDEF,+91 987654321,Home Loan,Post Due
  // 21563XYZABC,+91 876543210,Personal Loan,Pre Due
  // 384683467ASD,+91 9963956010,`;

  // Example CSV data with headers in the first column
  // const csvData = `
  // Customer Unique ID,21561GDSHDJD,21562ABCDEF,21563XYZABC,384683467ASD
  // Mobile Number,+91 998765432,+91 987654321,+91 876543210,+91 9963956010
  // Loan Type,Car Loan, Home Loan,Personal Loan,
  // Flow Type,Pre Due,Post Due,Pre Due`;

  const [isRowHeader, setIsRowHeader] = useState("Row");
  const [formattedData, setFormattedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [chartType, setSelectChartType] = useState("Bar Chart");
  const [chartData, setChartData] = useState([]);

  const handleCSVType = ({ target: { value } }) => {
    setIsRowHeader(value);
  };

  const handleChartType = ({ target: { value } }) => {
    setSelectChartType(value);
  };

  const parseCSV = useCallback(
    (csv) => {
      const parsedData = Papa.parse(csv, {
        header: isRowHeader === "Row", // Assume no headers initially
        skipEmptyLines: true
      });

      if (isRowHeader === "Row") {
        setFormattedData(parsedData.data);
      } else {
        let data = parsedData.data;
        // Extract the first column as headers
        const headers = data.map((row) => row[0]);
        data = data.map((row) => row.slice(1)); // Remove the first column from data
        // Transpose the data matrix (rows to columns) to get values
        const values = data[0].map((_, colIndex) =>
          data.map((row) => row[colIndex])
        );
        // Format the data into an array of objects
        const updatedData = values.map((row) => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header.trim()] = row[index];
          });
          return rowData;
        });
        setFormattedData(updatedData);
      }
    },
    [isRowHeader]
  );

  useEffect(() => {
    parseCSV(csvData);
  }, [isRowHeader, csvData, parseCSV]);

  useEffect(() => {
    if (formattedData && formattedData.length > 0) {
      setHeaders(getUniqueKeys(formattedData));
    }
  }, [formattedData]);

  useEffect(() => {
    const stackBarData = getProcessedStackBarData(headers, formattedData);
    if (selectedLabel.length > 0 && selectedLabel !== "Default") {
      if (stackBarData?.entireData.hasOwnProperty(selectedLabel)) {
        const selectLabelInfo = {
          [selectedLabel]: stackBarData?.entireData[selectedLabel]
        };
        const selectChartData = Object.values(selectLabelInfo)[0];
        setChartData({
          labels: Object.keys(selectChartData),
          selectedlabel: selectedLabel,
          dataset: {
            data: Object.values(selectChartData)
          }
        });
      }
    } else {
      setChartData({
        labels: stackBarData.labels,
        datasets: stackBarData.stackedData
      });
    }
  }, [selectedLabel, formattedData, headers]);

  return (
    <div className={styles.dashBoardWrapper}>
      <div className={styles.dashBoardHeader}>
        <p>In the uploaded CSV, the headers are in your first:</p>
        <Radio.Group
          options={csvOptions}
          onChange={handleCSVType}
          value={isRowHeader}
          optionType="button"
          buttonStyle="solid"
        />

        {selectedLabel.length > 0 && selectedLabel !== "Default" && (
          <>
            <p>Select the Chart Type:</p>
            <Radio.Group
              options={chartTypeOptions}
              onChange={handleChartType}
              value={chartType}
              optionType="button"
            />
          </>
        )}

        {headers && (
          <DropdownButton
            labels={["Default", ...headers]}
            sendSelectedLabel={(label) => setSelectedLabel(label)}
          />
        )}
      </div>
      <div className={styles.chartsWrapper}>
        {selectedLabel.length > 0 && selectedLabel !== "Default" ? (
          chartType === "Line Chart" ? (
            <LineChart chartData={chartData} />
          ) : chartType === "Donut Chart" ? (
            <DoughNutChart chartData={chartData} />
          ) : (
            <BarChart chartData={chartData} />
          )
        ) : (
          <StackedBarChart data={chartData} />
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
