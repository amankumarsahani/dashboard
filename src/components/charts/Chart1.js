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
import Loading from "./Loading.js";

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
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,

  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
  },
};

export default function Chart1({ data }) {
  if (data) {
    let labels = data.dataLabels;

    return (
      <Line
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: "X-Axis",
              data: data.dataX,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgb(255, 99, 132)",
              yAxisID: "y",
            },
            {
              label: "Y-Axis",
              data: data.dataY,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgb(53, 162, 235)",
              yAxisID: "y",
            },
            {
              label: "Z-Axis",
              data: data.dataZ,
              borderColor: "#16a085",
              backgroundColor: "#16a085",
              yAxisID: "y",
            },
          ],
        }}
      />
    );
  } else return <Loading />;
}
