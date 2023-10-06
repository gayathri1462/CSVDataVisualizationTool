import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { Chart, registerables } from "chart.js";
import DoughnutLabel from "chartjs-plugin-doughnutlabel-v3";
import styles from "./DonutChart.module.scss";
import DownloadBtn from "../downloadBtn/DownloadBtn";

Chart.register(...registerables, DoughnutLabel);

const DoughNutChart = ({ chartData }) => {
  const chartRef = useRef(null);

  const data = useMemo(() => {
    return {
      datasets: [
        {
          data: chartData?.dataset?.data
        }
      ],
      labels: chartData?.labels
    };
  }, [chartData]);

  const getTotalDonutChart = useCallback(() => {
    const sum = chartData?.dataset?.data.reduce((a, b) => a + b, 0);
    return `${sum}`;
  }, [chartData]);

  const donutChartLabel = useMemo(() => {
    return [
      {
        text: "Total",
        color: "#737373",
        font: {
          size: "12",
          family: "Roboto",
          weight: "500"
        }
      },
      {
        text: getTotalDonutChart,
        font: {
          size: "20",
          family: "Roboto",
          weight: "700"
        },
        color: "#0A0A0A"
      }
    ];
  }, [getTotalDonutChart]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateScale: true,
        animateRotate: true
      },
      layout: { padding: 5, autoPadding: true },
      plugins: {
        legend: {
          display: true,
          position: "right",
          align: "start",
          labels: {
            usePointStyle: true,
            padding: 15,
            color: "#838383",
            font: "13px"
          }
        },
        doughnutLabel: {
          labels: donutChartLabel
        },
        tooltip: {
          enabled: true,
          displayColors: false,
          backgroundColor: "#B6B6B6",
          titleColor: "#fff",
          titleFont: { weight: 400, size: 13 },
          titleAlign: "left",
          bodyColor: "#fff",
          bodyFont: { weight: 400, size: 13 },
          bodyAlign: "left",
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.dataset.data[tooltipItem.dataIndex];
              const label = tooltipItem.label;
              return `${label}: ${value}`;
            },
            title: () => {
              return "";
            }
          }
        }
      }
    };
  }, [donutChartLabel]);

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
      a.download = "Donut Chart.png";
      a.style.display = "none";

      // Append the link to the body and trigger the click event
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
    }
  }, []);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: options
    });

    return () => {
      chartInstance.destroy(); // Cleanup the chart instance when the component unmounts
    };
  }, [data, options]);

  return (
    <div className={styles.doughNutChartWrapper}>
      <DownloadBtn text="Download Chart" handleDownload={downloadChartImage} />
      <div className={styles.chartDiv}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default DoughNutChart;
