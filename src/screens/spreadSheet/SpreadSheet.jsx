import React, { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SpreadSheet.module.scss";
import { Spreadsheet, createEmptyMatrix } from "react-spreadsheet";
import { Empty, Dropdown, Button, message } from "antd";
import debounce from "lodash/debounce";
import CustomSearch from "../../components/search/Search";
import DownloadBtn from "../../components/downloadBtn/DownloadBtn";
import {
  downloadCSV,
  convertToCSV,
  rowItems,
  columnItems
} from "../../utils/index";
import { setUploadedFile } from "../../redux/csvData/csvDataSlice";

const SpreadSheet = () => {
  const dispatch = useDispatch();
  const spreadSheetData = useSelector(
    (state) => state?.csvInfo?.spreadSheetData
  );
  const [tableData, setTableData] = useState(
    spreadSheetData || createEmptyMatrix(0, 0)
  );
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [selectedColIndex, setSelectedColIndex] = useState(-1);
  const [selectedCell, setSelectedCell] = useState([]);
  const [filteredData, setFilteredData] = useState(tableData);
  const [searchText, setSearchText] = useState("");
  const [isColumnMenuSelected, setIsColumnMenuSelected] = useState(false);
  const [isToBeSaved, setIsToBeSaved] = useState(false);
  const [clearedData, setClearedData] = useState(false);

  //For cell value change
  const handleDataChange = (data) => {
    setIsToBeSaved(true);
    setClearedData(false);
    const currentRow = selectedCell?.[0]?.row;

    if (searchText.trim().length !== 0) {
      setFilteredData(data);
    }

    if (currentRow >= 0) {
      // Update only the changed row
      setTableData((prevTableData) => {
        const updatedTableData = [...prevTableData];
        updatedTableData[currentRow] = data[currentRow];
        return updatedTableData;
      });
    }
  };

  const debouncedSetData = debounce(handleDataChange, 300);

  //To get the active cell index
  const handleCellSelect = (selectedCell) => {
    if (selectedCell.length > 0) {
      setSelectedCell(selectedCell);
    } else {
      setSelectedCell([]);
    }
  };

  // Copy Functions
  const copyRow = () => {
    if (selectedRowIndex >= 0) {
      const selectedRow = tableData?.[selectedRowIndex];
      navigator.clipboard.writeText(JSON.stringify(selectedRow));
      message.success("Successfully copied the row!");
    }
  };

  const copyColumn = () => {
    if (selectedColIndex >= 0) {
      const selectedColumn = tableData?.map((col) => {
        const cell = col[selectedColIndex];
        return {
          value: cell?.value || "",
          className: cell?.className || ""
        };
      });
      navigator.clipboard.writeText(JSON.stringify(selectedColumn));
      message.success("Successfully copied the column!");
    }
  };

  // Cut Functions
  const cutRow = () => {
    if (selectedRowIndex >= 0) {
      const selectedRow = tableData?.[selectedRowIndex];
      navigator.clipboard.writeText(JSON.stringify(selectedRow));
      const newData = [...tableData];
      newData[selectedRowIndex] = Array.from(
        { length: selectedRow.length },
        () => ({ value: "", className: "" })
      );
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully cut the row");
    }
  };

  const cutColumn = () => {
    if (selectedColIndex >= 0) {
      const selectedColumn = tableData?.map((col) => {
        const cell = col[selectedColIndex];
        return {
          value: cell?.value || "",
          className: cell?.className || ""
        };
      });
      navigator.clipboard.writeText(JSON.stringify(selectedColumn));
      const newData = tableData?.map((row) => {
        const newRow = [...row];
        newRow[selectedColIndex] = { value: "", className: "" };
        return newRow;
      });
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully cut the column");
    }
  };

  // Paste Functions
  const pasteRow = async () => {
    if (selectedRowIndex >= 0) {
      const clipboardData = await navigator.clipboard.readText();
      const rowData = JSON.parse(clipboardData);
      const newData = [...tableData];
      newData[selectedRowIndex] = rowData;
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully pasted the row");
    }
  };

  const pasteColumn = async () => {
    if (selectedColIndex >= 0) {
      const clipboardData = await navigator.clipboard.readText();
      const columnData = JSON.parse(clipboardData);
      const newData = tableData?.map((row, rowIndex) => {
        const newRow = [...row];
        const cell = columnData?.[rowIndex] || {};
        newRow[selectedColIndex] = {
          value: cell?.value || "",
          className: cell.className || ""
        };
        return newRow;
      });
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully pasted the column");
    }
  };

  // Insert Functions
  const insertNewRow = () => {
    if (selectedRowIndex >= 0) {
      const maxRowLength = Math.max(...tableData.map((row) => row.length));
      const newRow = Array.from({ length: maxRowLength }, () => ({
        value: "",
        className: ""
      }));
      const newData = [...tableData];
      newData.splice(selectedRowIndex + 1, 0, newRow);
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully inserted the row");
    }
  };

  const insertNewColumn = () => {
    if (selectedColIndex >= 0) {
      const newData = tableData?.map((col) => {
        const newColumn = [...col];
        newColumn.splice(selectedColIndex + 1, 0, { value: "", className: "" });
        return newColumn;
      });
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully inserted the column");
    }
  };

  // Delete Functions
  const deleteRow = () => {
    if (selectedRowIndex >= 0) {
      const newData = tableData.filter(
        (_, index) => index !== selectedRowIndex
      );
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully deleted the row");
    }
  };

  const deleteColumn = () => {
    if (selectedColIndex >= 0) {
      const newData = tableData?.map((row) =>
        row.filter((_, index) => index !== selectedColIndex)
      );
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully deleted the column");
    }
  };
  // Clear Functions
  const clearRowContent = () => {
    if (selectedRowIndex >= 0) {
      const newData = tableData.map((row, index) =>
        index === selectedRowIndex
          ? row.map(() => ({ value: "", className: "" }))
          : row
      );
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully cleared the row");
    }
  };

  const clearColumnContent = () => {
    if (selectedColIndex >= 0) {
      const newData = tableData.map((col) => {
        const newColumn = [...col];
        newColumn[selectedColIndex] = { value: "", className: "" };
        return newColumn;
      });
      setTableData(newData);
      setIsToBeSaved(true);
      message.success("Successfully cleared the column");
    }
  };

  // Sorting Function

  const handleMenuSelect = (event) => {
    const key = event.key;
    switch (key) {
      case "1":
        isColumnMenuSelected ? copyColumn() : copyRow();
        break;
      case "2":
        isColumnMenuSelected ? cutColumn() : cutRow();
        break;
      case "3":
        isColumnMenuSelected ? pasteColumn() : pasteRow();
        break;
      case "4":
        isColumnMenuSelected ? insertNewColumn() : insertNewRow();
        break;
      case "5":
        isColumnMenuSelected ? deleteColumn() : deleteRow();
        break;
      case "6":
        isColumnMenuSelected ? clearColumnContent() : clearRowContent();
        break;
      default:
        break;
    }
  };

  //Row Indicator
  const RowIndicator = ({ row, onSelect, selected }) => {
    const handleClick = useCallback(
      (event) => {
        onSelect(row, event.shiftKey);
        setSelectedRowIndex(row);
        setIsColumnMenuSelected(false);
      },
      [onSelect, row]
    );

    return (
      <Dropdown
        menu={{ items: rowItems, onClick: handleMenuSelect }}
        placement="bottomLeft"
        trigger={selected ? ["hover"] : ["click"]}
        overlayClassName={styles.dropdownStyling}
      >
        <th
          className={`${
            !selected ? "Spreadsheet__header" : "Spreadsheet__header--selected"
          }`}
          onClick={handleClick}
          tabIndex={0}
        >
          {row + 1}
        </th>
      </Dropdown>
    );
  };

  //Column Indicator
  const columnIndexToLabel = (column) => {
    let label = "";
    let index = column;
    while (index >= 0) {
      label = String.fromCharCode(65 + (index % 26)) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const ColumnIndicator = ({ column, onSelect, selected }) => {
    const handleClick = useCallback(
      (event) => {
        onSelect(column, event.shiftKey);
        setSelectedColIndex(column);
        setIsColumnMenuSelected(true);
      },
      [onSelect, column]
    );

    return (
      <Dropdown
        menu={{ items: columnItems, onClick: handleMenuSelect }}
        placement="bottomLeft"
        trigger={selected ? ["hover"] : ["click"]}
        overlayClassName={styles.dropdownStyling}
      >
        <th
          className={`${
            !selected ? "Spreadsheet__header" : "Spreadsheet__header--selected"
          }`}
          onClick={handleClick}
          tabIndex={0}
        >
          <div>{columnIndexToLabel(column)}</div>
        </th>
      </Dropdown>
    );
  };

  // search Function
  const handleSearchChange = debounce((searchValue) => {
    setSearchText(searchValue);

    const trimSearchText = searchValue.trim().toLowerCase();

    if (trimSearchText.length === 0) {
      setFilteredData(tableData);
    } else {
      const headerRow = tableData[0];
      const filteredRows = tableData
        .slice(1)
        .filter((row) =>
          row.some(
            (cell, columnIndex) =>
              columnIndex !== 0 &&
              cell?.value.toString().toLowerCase().includes(trimSearchText)
          )
        );
      const filteredDataWithHeader = [headerRow, ...filteredRows];
      setFilteredData(filteredDataWithHeader);
    }
  }, 300);

  const handleClearAll = () => {
    setClearedData(true);
    setTableData(createEmptyMatrix(1, 1));
    message.success("Successfully cleared the entire data");
  };

  //Data To display on spreadsheet
  const updatedData = useMemo(() => {
    const tableInfo = searchText?.length === 0 ? tableData : filteredData;
    return tableInfo;
  }, [searchText, tableData, filteredData]);

  return (
    <>
      <div className={styles.spreadSheetWrapper}>
        {!clearedData && (
          <div className={styles.functionsDiv}>
            <CustomSearch handleSearch={handleSearchChange} />
            <DownloadBtn
              handleDownload={() => downloadCSV(tableData)}
              text={"Download CSV"}
              size={"large"}
            />
            {isToBeSaved && (
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  dispatch(
                    setUploadedFile({
                      spreadSheetData: tableData,
                      csvData: convertToCSV(tableData)
                    })
                  );
                  message.success("Successfully updated the data!");
                }}
              >
                Save
              </Button>
            )}
            <Button danger onClick={handleClearAll} size={"large"}>
              Clear All
            </Button>
          </div>
        )}
        <div className={styles.spreadSheetDiv}>
          <Spreadsheet
            data={updatedData}
            onChange={debouncedSetData}
            className={styles.spreadSheet}
            RowIndicator={RowIndicator}
            ColumnIndicator={ColumnIndicator}
            onSelect={handleCellSelect}
          />
          {clearedData && (
            <div className={styles.emptyDataDiv}>
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 60 }}
                description={
                  <span style={{ color: "#1677FF" }}>CSV has no data</span>
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SpreadSheet;
