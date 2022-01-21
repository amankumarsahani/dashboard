import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Loading from "../Loading.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  maintainAspectRatio: false,

  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: "Accelerometer",
      font: {
        size: 18,
      },
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      grid: {
        color: "#FFFFFF11",
      },
    },
  },
};

export default function AccChart({ data, type, theme }) {
  if (type === undefined) {
    type = {
      dataX: "line",
      dataY: "line",
      dataZ: "line",
      abs: "bar",
    };
  } else {
    if (data && data.dataLabels.length === 1) {
      type = {
        dataX: "bar",
        dataY: "bar",
        dataZ: "bar",
        abs: "bar",
      };
    } else {
      type = {
        dataX: "line",
        dataY: "line",
        dataZ: "line",
        abs: "bar",
      };
    }
  }
  const color = {
    dataX: "rgb(255, 99, 132)",
    dataY: "rgb(53, 162, 235)",
    dataZ: "#16a085",
    mag: theme ? "#e056fd" : "#686de0",
  };

  if (data) {
    let labels = data.dataLabels;
    const tension = 0.3;
    return (
      <Line
        options={options}
        data={{
          labels,
          datasets: [
            {
              type: type.dataX,
              label: "X-Axis",
              data: data.dataX,
              borderColor: color.dataX,
              backgroundColor: color.dataX,
              yAxisID: "y",
              tension: tension,
            },
            {
              type: type.dataY,
              label: "Y-Axis",
              data: data.dataY,
              borderColor: color.dataY,
              backgroundColor: color.dataY,
              yAxisID: "y",
              tension: tension,
            },
            {
              type: type.dataZ,
              label: "Z-Axis",
              data: data.dataZ,
              borderColor: color.dataZ,
              backgroundColor: color.dataZ,
              yAxisID: "y",
              tension: tension,
            },
            {
              type: type.abs,
              label: "Magnitude",
              data: data.abs,
              borderColor: color.mag,
              backgroundColor: color.mag,
              yAxisID: "y",
              tension: tension,
            },
          ],
        }}
      />
    );
  } else return <Loading />;
}
