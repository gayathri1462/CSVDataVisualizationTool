import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { Chart, registerables } from "chart.js";
import styles from "./StackedBarChart.module.scss";
import { Chart as ChartJS } from "chart.js"; // Import the Chart interface separately
import ChartDataLabels from "chartjs-plugin-datalabels";
import DownloadBtn from "../downloadBtn/DownloadBtn";

ChartJS.register(...registerables);

const StackedBarChart = ({ data }) => {
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
          display: false
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
          position: "nearest",
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.dataset.data[tooltipItem.dataIndex];
              const label = tooltipItem.dataset.label[tooltipItem.dataIndex];
              return `${label}: ${value}`;
            }
            // title: () => {
            //   return "";
            // }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          display: true,
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
          stacked: true,
          display: true,
          beginAtZero: true,
          grace: 2,

          grid: {
            display: true
          },
          min: 0,
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
        }
      }
    };
  }, []);

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
      a.download = "Stacked Bar Chart.png";
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
        type: "bar",
        data: data,
        options: options,
        plugins: [ChartDataLabels]
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [data, options]);

  return (
    <div className={styles.stackedBarChartWrapper}>
      <DownloadBtn text="Download Chart" handleDownload={downloadChartImage} />
      <div className={styles.chartDiv}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default StackedBarChart;
