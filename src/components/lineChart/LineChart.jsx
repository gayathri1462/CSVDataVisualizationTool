import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { Chart, registerables } from "chart.js";
import styles from "./LineChart.module.scss";
import DownloadBtn from "../downloadBtn/DownloadBtn";

Chart.register(...registerables);

const LineChart = ({ chartData }) => {
  const chartRef = useRef(null);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateScale: true,
        animateRotate: true
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          enabled: true,
          displayColors: true,
          backgroundColor: "#676767",
          cornerRadius: 1,
          titleColor: "#fff",
          titleFont: { weight: 400, size: 13 },
          titleAlign: "left",
          bodyColor: "#fff",
          bodyFont: { weight: 400, size: 13 },
          bodyAlign: "left",
          position: "nearest"
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: chartData?.selectedlabel,
            align: "center",
            color: "#7A7979",
            font: {
              size: 14,
              family: "Inter",
              weight: "400"
            },
            padding: 5
          },
          grid: {
            display: false
          },
          ticks: {
            color: "#838383",
            font: {
              size: 13,
              family: "Inter",
              weight: "400"
            },
            padding: 1
          },
          border: {
            dash: [1, 1],
            drawBorder: true
          }
        },
        y: {
          display: true,
          beginAtZero: true,
          title: {
            display: true,
            text: `No. of ${chartData?.selectedlabel}`,
            align: "center",
            color: "#7A7979",
            font: {
              size: 14,
              family: "Inter",
              weight: "400"
            },
            padding: 5
          },
          grid: {
            display: true
          },
          min: 0,
          // max: axesData?.maxYValue,
          ticks: {
            // stepSize: axesData?.stepYValue,
            color: "#838383",
            font: {
              size: 13,
              family: "Inter",
              weight: "400"
            },
            padding: 1
          },
          border: {
            dash: [1, 1],
            drawBorder: true
          }
        }
      }
    };
  }, [chartData]);

  const chartInfo = useMemo(() => {
    return {
      labels: chartData?.labels, // Array of labels for the x-axis
      datasets: [
        {
          label: chartData?.selectedlabel, // Label for the dataset
          data: chartData?.dataset?.data, // Array of data points for the y-axis
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
          fill: true,
          pointBorderColor: "#AAA",
          pointBackgroundColor: "#FEF1F1"
        }
      ]
    };
  }, [chartData]);

  const downloadChartImage = useCallback(() => {
    if (chartRef.current) {
      const chartCanvas = chartRef.current;

      // Create a new canvas element with padding
      const padding = 10; // Adjust the padding size as needed
      const paddedCanvas = document.createElement("canvas");
      const ctx = paddedCanvas.getContext("2d");

      paddedCanvas.width = chartCanvas.width + 2 * padding;
      paddedCanvas.height = chartCanvas.height + 2 * padding;

      // Draw the chart image onto the new canvas with padding
      ctx.fillStyle = "#fff"; // Set the padding background color to white
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
      ctx.drawImage(chartCanvas, padding, padding);

      // Create a download link
      const a = document.createElement("a");
      a.href = paddedCanvas.toDataURL("image/png");
      a.download = "Line Chart.png";
      a.style.display = "none";

      // Append the link to the body and trigger the click event
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      const chartInstance = new Chart(ctx, {
        type: "line",
        data: chartInfo,
        options: options
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [chartInfo, options]);

  return (
    <div className={styles.lineChartWrapper}>
      <DownloadBtn text="Download Chart" handleDownload={downloadChartImage} />
      <div className={styles.chartDiv}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default LineChart;
