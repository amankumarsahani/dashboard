import { Chart, registerables } from "chart.js";
import { Line, getDatasetAtEvent, getElementAtEvent } from "react-chartjs-2";
import { hexWithAlpha } from "../../utils.js";
import { useState, useRef } from "react";

Chart.register(...registerables);
// Chart.global.defaults.font.family = "Exo 2, sans-serif";
export default function ReactChart({
  title,
  titleAlign = "start",
  xLabel,
  yLabelArr,
  yAxisIDArr,
  yDataArr,
  typeArr,
  colorArr,
  legend = true,
  legendColor,
  fillArr,
  fontSize = 14,
  gridArr = [1, 1],
  gridColor = "#ffffff11",
  giveIndex = 0,
  offset = false,
  forwardedRef = null,
  setPoint = null,
  clickable = true,
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
      borderWidth: 0.15 * fontSize,
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
        display: title !== "",
        text: title,
        position: "top",
        align: titleAlign,
        padding: fontSize * 0.8,
        color: legendColor,
        font: {
          family: "Exo",
          size: fontSize * 1.4,
          weight: "400",
        },
      },
      legend: {
        display: legend,
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
        radius: (pra * 3 * fontSize) / 16,
        hoverRadius: fontSize * 0.6,
      },
    },
    events: ["click", "mousemove"],
    onClick: function (event) {
      if (!clickable) return;
      if (!forwardedRef) return;
      const chartArea = forwardedRef.current.chartArea;
      const { left, right, top, bottom } = chartArea;
      if (
        event.x > left &&
        event.x < right &&
        event.y > top &&
        event.y < bottom
      ) {
        setPra(!pra);
      }
    },
  };
  const onclcl = (event) => {
    const ele = getElementAtEvent(forwardedRef.current, event);
    if (!ele.length) return;
    if (setPoint === null) return;
    setPoint([ele[0].index, Math.random()]);
  };
  return (
    <Line
      ref={forwardedRef}
      data={{
        labels: giveIndex ? xLabel.map((_, i) => i + 1) : xLabel,
        datasets: datasets,
      }}
      options={options}
      onClick={onclcl}
    />
  );
}
