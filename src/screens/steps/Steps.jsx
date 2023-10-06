import { Button, message, Steps } from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Steps.module.scss";
import CSVUpload from "../csvUpload/CsvUpload";
import SpreadSheet from "../spreadSheet/SpreadSheet";
import ChartComponent from "../dashboard/Dashboard";
import {
  setCurrentIndex,
  updateStepsStatus
} from "../../redux/steps/stepsSlice";

const CustomSteps = () => {
  const dispatch = useDispatch();
  const { data: status, currentIndex } = useSelector(
    (state) => state?.stepsInfo
  );
  const steps = [
    {
      title: "CSV Upload",
      description: "Upload your CSV data file to get started.",
      subTitle: "Quick and Easy",
      status: status?.csvUpload,
      content: (
        <div className={styles.csvUploadWrapper}>
          <CSVUpload />
        </div>
      )
    },
    {
      title: "View CSV",
      description: "View your uploaded CSV data and make edits if needed.",
      subTitle: "Edit Data On-the-Fly",
      status: status?.viewData,
      content: <SpreadSheet />
    },
    {
      title: "Visualized Data",
      description:
        "See your data come to life with interactive visualizations.",
      subTitle: "Understand Your Data Better",
      status: status?.visualizeData,
      content: <ChartComponent />
    }
  ];

  const [current, setCurrent] = useState(currentIndex || 0);

  const next = () => {
    setCurrent(current + 1);
    dispatch(setCurrentIndex(current + 1));
    if (current === 1) {
      dispatch(
        updateStepsStatus({
          viewData: "finish"
        })
      );
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    dispatch(setCurrentIndex(current - 1));
  };

  const onChange = (value) => {
    if (items[0].status !== null) {
      setCurrent(value);
      dispatch(setCurrentIndex(value));
    }
  };

  const items = steps.map((item) => ({
    key: item.title,
    ...item
  }));

  return (
    <div className={styles.stepsWrapper}>
      <Steps current={current} items={items} onChange={onChange} />
      <div className={styles.contentWrapper}>{steps[current].content}</div>
      <div className={styles.btnContainer}>
        {current < steps.length - 1 ? (
          <Button
            type="primary"
            disabled={items[0].status === null}
            onClick={() => next()}
          >
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            disabled={items[0].status === null}
            onClick={() => {
              dispatch(
                updateStepsStatus({
                  visualizeData: "finish"
                })
              );
              message.success("Thank you for visiting!");
            }}
          >
            Done
          </Button>
        )}
        {current > 0 && <Button onClick={() => prev()}>Previous</Button>}
      </div>
    </div>
  );
};

export default CustomSteps;
