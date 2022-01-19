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
import { Bar } from "react-chartjs-2";
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
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: "Carbon Dioxide Levels",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
  },
};

export default function Chart3({ data }) {
  if (data) {
    let labels = data.dataLabels;

    return (
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: "CO\u2082",
              data: data.data.co2,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgb(255, 99, 132)",
              yAxisID: "y",
            },
          ],
        }}
      />
    );
  } else return <Loading />;
}
