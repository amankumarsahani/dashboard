import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { genRan, hexWithAlpha } from "../../utils.js";

Chart.register(...registerables);

export default function ReactChart({
  title,
  xLabel,
  yLabelArr,
  yAxisIDArr,
  yDataArr,
  typeArr,
  colorArr,
  fillArr,
  fontSize = 14,
  gridColor = "#ffffff11",
  pr = 0,
  giveIndex = 0,
}) {
  if (colorArr === []) {
    yDataArr.forEach((_, i) => {
      colorArr[i] = `hsl(
        ${genRan(0, 360)},
        100%,100%
      )`;
    });
  }
  let scales = {
    y: {
      position: "left",
      beginAtZero: true,
      grid: {
        display: true,
        color: gridColor,
      },
      ticks: {
        font: { size: fontSize },
      },
    },
    x: {
      beginAtZero: true,
      ticks: {
        maxRotation: 0,
        autoskip: true,
        autoSkipPadding: giveIndex ? 5 : 20,
        font: { size: fontSize },
      },
      grid: {
        display: true,
        color: gridColor,
      },
    },
  };

  const datasets = yDataArr.map((yData, i) => {
    if (yAxisIDArr[i] === "y1") {
      scales.y1 = {
        position: "right",
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: hexWithAlpha(colorArr[i], "dd"),
        },
      };
    }
    return {
      type: typeArr[i],
      label: yLabelArr[i],
      data: yData,
      backgroundColor: hexWithAlpha(colorArr[i], "33"),
      borderColor: colorArr[i],
      borderWidth: 2,
      yAxisID: yAxisIDArr[i],
      tension: 0.4,
      fill: fillArr[i],
    };
  });

  let options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: scales,
    plugins: {
      title: {
        display: false,
        text: title,
        position: "top",
        align: "start",
        color: "#00c3ff",
        font: {
          size: fontSize * 1.5,
          weight: "200",
        },
      },
      legend: {
        position: "top",
        align: "end",
        padding: 1,
        labels: {
          color: "#00c3ff",
          display: true,
          font: {
            size: fontSize * 1.2,
          },
        },
      },
      tooltip: {
        enabled: true,
        // usePointStyle: true,
        callbacks: {
          // To change title in tooltip
          title: (data) => {
            return xLabel[data[0].parsed.x];
          },
          // To change label in tooltip
          // label: (data) => {
          //   return data.parsed.y;
          // },
        },
      },
    },
    elements: {
      point: {
        radius: pr * 3,
        hoverRadius: 10,
      },
    },
  };

  return (
    <Line
      data={{
        labels: giveIndex ? xLabel.map((_, i) => i + 1) : xLabel,
        datasets: datasets,
      }}
      options={options}
    />
  );
}
