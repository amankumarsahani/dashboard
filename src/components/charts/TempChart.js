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
      text: "Temperature",
    },
    legend: {
      display: false,
    },
  },
  tooltips: {
    filter: function (tooltipItem, data) {
      var label = data.labels[tooltipItem.index];
      if (label == "Temperature") {
        return false;
      } else {
        return true;
      }
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

export default function TempChart({ data }) {
  if (data) {
    let labels = data.dataLabels;

    return (
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: "Temperature",
              data: data.temp,
              borderColor: "rgba(255, 99, 132, 0.5)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              yAxisID: "y",
            },
          ],
        }}
      />
    );
  } else return <Loading />;
}
