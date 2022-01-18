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
              label: "PM 10",
              data: data.data.pm10,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgb(255, 99, 132)",
              yAxisID: "y",
            },
            {
              label: "PM 25",
              data: data.data.pm25,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgb(53, 162, 235)",
              yAxisID: "y",
            },
            {
              label: "PM 40",
              data: data.data.pm40,
              borderColor: "#16a085",
              backgroundColor: "#16a085",
              yAxisID: "y",
            },
            {
              label: "PM 100",
              data: data.data.pm100,
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
