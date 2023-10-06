import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateStepsStatus } from "../../redux/steps/stepsSlice";
import { setUploadedFile } from "../../redux/csvData/csvDataSlice";
import { formatCSVToDataArray } from "../../utils/index";

const { Dragger } = Upload;

const CSVUpload = () => {
  const dispatch = useDispatch();
  const csvData = useSelector((state) => state?.csvInfo?.file);

  const props = {
    name: "file",
    accept: ".csv",
    multiple: false,
    maxCount: 1,
    defaultFileList: csvData ? [csvData] : [],
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      // if (status !== "uploading") {
      //   console.log(info.file, info.fileList, "data");
      // }
      if (status === "done") {
        // Read the file content and parse it
        const reader = new FileReader();
        reader.onload = async (e) => {
          const csv = e.target.result;
          const result = formatCSVToDataArray(csv); // Parse the CSV
          const payload = {
            file: {
              name: info.file.name,
              size: info.file.size
            },
            csvData: csv,
            spreadSheetData: result.data
          };

          if (result) {
            dispatch(setUploadedFile(payload));
            dispatch(
              updateStepsStatus({
                csvUpload: "finish"
              })
            );
            message.success(`${info.file.name} file uploaded successfully.`);
          } else {
            message.error(`Error parsing ${info.file.name} file.`);
          }
        };
        reader.readAsText(info.file.originFileObj);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click on this area to upload CSV File</p>
      <p className="ant-upload-hint">
        Support for a single small upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
};

export default CSVUpload;
