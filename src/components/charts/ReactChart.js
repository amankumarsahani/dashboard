import { saveAs } from "file-saver";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { hexWithAlpha } from "../../utils.js";
import { useState } from "react";

Chart.register(...registerables);
// Chart.global.defaults.font.family = "Exo 2, sans-serif";
export default function ReactChart({
  title,
  xLabel,
  yLabelArr,
  yAxisIDArr,
  yDataArr,
  typeArr,
  colorArr,
  legendColor,
  fillArr,
  fontSize = 14,
  gridArr = [1, 1],
  gridColor = "#ffffff11",
  giveIndex = 0,
  offset = false,
  forwardedRef,
}) {
  const [pra, setPra] = useState(1);
  let scales = {
    y: {
      position: "left",
      beginAtZero: true,
      grid: {
        display: gridArr[1],
        color: gridColor,
      },
      ticks: {
        font: { size: fontSize * 0.9 },
      },
    },
    x: {
      offset: offset,
      ticks: {
        maxRotation: 0,
        autoskip: true,
        autoSkipPadding: giveIndex ? 5 : 20,
        // major: {
        //   enabled: true,
        // },
        font: { size: fontSize * 0.9 },
        // font: function (context) {
        //   if (context.tick && context.tick.major) {
        //     return {
        //       weight: "bold",
        //     };
        //   }
        // },
      },
      grid: {
        display: gridArr[0],
        color: gridColor,
      },
    },
  };

  let datasets = yDataArr.map((yData, i) => {
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
    // defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
    //   "Exo 2, sans-serif"),
    responsive: true,
    maintainAspectRatio: false,
    scales: scales,
    plugins: {
      title: {
        display: title !== "",
        text: title,
        position: "top",
        align: "start",
        padding: 0,
        color: legendColor,
        font: {
          family: "Dongle",
          size: fontSize * 3,
          weight: "300",
        },
      },
      legend: {
        position: "top",
        align: "end",
        padding: 1,
        labels: {
          color: legendColor,
          display: true,
          font: {
            size: fontSize * 0.9,
          },
        },
        // //for reverse of default legend click
        // onClick: function (e, legendItem) {
        //   var index = legendItem.datasetIndex;
        //   var ci = this.chart;
        //   var alreadyHidden =
        //     ci.getDatasetMeta(index).hidden === null
        //       ? false
        //       : ci.getDatasetMeta(index).hidden;

        //   ci.data.datasets.forEach(function (e, i) {
        //     var meta = ci.getDatasetMeta(i);

        //     if (i !== index) {
        //       if (!alreadyHidden) {
        //         meta.hidden = meta.hidden === null ? !meta.hidden : null;
        //       } else if (meta.hidden === null) {
        //         meta.hidden = true;
        //       }
        //     } else if (i === index) {
        //       meta.hidden = null;
        //     }
        //   });
        //   ci.update();
        // },
      },
      tooltip: {
        enabled: true,
        usePointStyle: true,
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
        radius: pra * 3,
        hoverRadius: 10,
      },
    },
  };

  return (
    <Line
      ref={forwardedRef}
      data={{
        labels: giveIndex ? xLabel.map((_, i) => i + 1) : xLabel,
        datasets: datasets,
      }}
      options={options}
      onClick={() => setPra(!pra)}
    />
  );
}
