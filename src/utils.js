import moment from "moment";
import AnimatedNumber from "animated-number-react";
import ReactLoading from "react-loading";

import React from "react";

export function makeTempData(
  arr,
  xKey = "DeviceID",
  sortKey = "time_stmp",
  retKey = "Temperature_degC"
) {
  arr.sort((a, b) => timeDateSorter(a, b, sortKey));
  let dataLabels = [];
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(arr[i][xKey]);
    temp.push(Math.abs(arr[i][retKey]) > 100 ? 0 : arr[i][retKey]);
  }
  return { dataLabels, temp };
}

export function makeTempDataFromQuery(
  arr,
  xKey = "DeviceID",
  sortKey = "time_stmp",
  retKey = "Value"
) {
  arr.sort((a, b) => timeDateSorter(a, b, sortKey));
  let dataLabels = [];
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(moment(toDate(arr[i][xKey])).format("lll"));
    temp.push(Math.abs(arr[i][retKey]) > 100 ? 0 : arr[i][retKey]);
  }
  return { dataLabels, temp };
}

export function makeAccData(arr, xKey = "DeviceID", sortKey = "time_stmp") {
  arr.sort((a, b) => timeDateSorter(a, b, sortKey));
  let dataLabels = [];
  let dataX = [];
  let dataY = [];
  let dataZ = [];
  let abs = [];
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(arr[i][xKey]);
    dataX.push(arr[i].X_axis);
    dataY.push(arr[i].Y_axis);
    dataZ.push(arr[i].Z_axis);
    let x = Math.pow(
      Math.pow(arr[i].X_axis, 2) +
        Math.pow(arr[i].Y_axis, 2) +
        Math.pow(arr[i].Z_axis, 2),
      0.5
    );
    abs.push(x);
  }
  return { dataLabels, dataX, dataY, dataZ, abs };
}

export function makeAccDataFromQuery(
  arr,
  xKey = "DeviceID",
  sortKey = "time_stmp",
  retKey = "Value"
) {
  arr.sort((a, b) => timeDateSorter(a, b, sortKey));
  let dataLabels = [];
  let dataX = [];
  let dataY = [];
  let dataZ = [];
  let abs = [];
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(moment(toDate(arr[i][xKey])).format("lll"));

    // dataLabels.push(
    //   moment(toDate(arr[i][xKey])).format("MMM Do YY") +
    //     " " +
    //     moment(toDate(arr[i][xKey])).format("LTS")
    // );

    let val = arr[i][retKey];
    val = val.split(",");
    dataX.push(val[0]);
    dataY.push(val[1]);
    dataZ.push(val[2]);
    let x = Math.pow(
      Math.pow(val[0], 2) + Math.pow(val[1], 2) + Math.pow(val[2], 2),
      0.5
    );
    abs.push(x);
  }
  return { dataLabels, dataX, dataY, dataZ, abs };
}

function toDate(a) {
  a = a.substring(3, 6) + a.substring(0, 3) + a.substring(6);
  return new Date(a);
}

function timeDateSorter(_a, _b, key) {
  let a = _a[key];
  let b = _b[key];

  let p = toDate(a);
  let q = toDate(b);
  if (p < q) return -1;
  else if (p > q) return 1;
  return 0;
}

export const makeWaterData = (arr) => {
  arr.sort((a, b) => timeDateSorter(a, b, "Timestamp"));
  let [dataLabels, tds, cod, bod, ph, temp, ec] = [[], [], [], [], [], [], []];
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(moment(toDate(arr[i]["Timestamp"])).format("lll"));
    tds.push(Math.abs(arr[i].TDS) > 1000 ? 0 : arr[i].TDS);
    cod.push(Math.abs(arr[i].COD) > 100 ? 0 : arr[i].COD);
    bod.push(Math.abs(arr[i].BOD) > 100 ? 0 : arr[i].BOD);
    ph.push(Math.abs(arr[i].pH) > 20 ? 0 : arr[i].pH);
    temp.push(Math.abs(arr[i].Temperature) > 70 ? 0 : arr[i].Temperature);
    ec.push(
      Math.abs(arr[i]["Electro-conductivity"]) > 100
        ? 0
        : arr[i]["Electro-conductivity"]
    );
  }
  return { dataLabels, tds, cod, bod, ph, temp, ec };
};
export const genRan = (min, max) => {
  let x = min + Math.floor(Math.random() * (max - min));
  return x;
};

export const hexWithAlpha = (hex, alpha) => `${hex}${alpha}`;

export const NumberAnimated = ({ data, dig = 0 }) => {
  const formatValue = (data) => data.toFixed(dig);
  return <AnimatedNumber value={data} formatValue={formatValue} />;
};

export const Loading = ({ height = 30, width = 30, theme }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <ReactLoading
        type={"bars"}
        color={theme ? "#00c3ff" : "#8676ff"}
        width={width}
        height={height}
      ></ReactLoading>
    </div>
  );
};

export const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

export const _3d_to_2d = (x, y, z, theta, phi) => {
  let rx = x * Math.cos(theta) - z * Math.sin(theta);
  let ry =
    y * Math.cos(phi) -
    z * Math.sin(phi) * Math.cos(theta) -
    x * Math.sin(phi) * Math.sin(theta);
  return { x: rx, y: ry };
};

export const draw3d = (cnv, x, y, z) => {
  const ctx = cnv.getContext("2d");

  cnv.width = cnv.offsetWidth;
  cnv.height = cnv.offsetHeight;

  // cnv.style.backgroundColor = "black";
  const o = { x: cnv.width / 3, y: cnv.height / 4 };

  ctx.clearRect(0, 0, cnv.width, cnv.height);
  let theta = Math.PI / 8;
  let phi = -Math.PI / 12;
  let p = _3d_to_2d(100, 0, 0, theta, phi);
  ctx.beginPath();
  ctx.arc(o.x, o.y, 5, 0, Math.PI * 2, true);
  ctx.strokeStyle = "grey";
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(o.x, o.y);
  ctx.lineTo(o.x + p.x, o.y + p.y);
  ctx.strokeStyle = "red";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(o.x, o.y);
  p = _3d_to_2d(0, 100, 0, theta, phi);
  ctx.lineTo(o.x + p.x, o.y + p.y);
  ctx.strokeStyle = "orange";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(o.x, o.y);
  p = _3d_to_2d(0, 0, 100, theta, phi);
  ctx.lineTo(o.x + p.x, o.y + p.y);
  ctx.strokeStyle = "lime";
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.beginPath();
  p = _3d_to_2d(x * 10, z * 10, y * 10, theta, phi);
  ctx.moveTo(o.x, o.y);
  ctx.lineTo(o.x + p.x, o.y + p.y);
  ctx.strokeStyle = "#00c3ff";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(o.x + p.x, o.y + p.y, 5, 0, Math.PI * 2, true);
  ctx.fillStyle = "#00c3ff";
  ctx.fill();
};
