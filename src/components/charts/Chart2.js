import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loading from "../Loading.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Temperature and Humidity",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export default function Chart2({ data }) {
  if (data) {
    let labels = data.dataLabels;
    return (
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: "Temperature ºC",
              data: data.data.temp,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgb(255, 99, 132)",
              yAxisID: "y",
            },
            {
              label: "Humidity",
              data: data.data.humi,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgb(53, 162, 235)",
              yAxisID: "y1",
            },
          ],
        }}
      />
    );
  } else return <Loading />;
}
