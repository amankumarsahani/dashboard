import moment from "moment";

export function makeTempData(
  arr,
  xKey = "DeviceID",
  sortKey = "time_stmp",
  retKey = "Temperature_degC"
) {
  arr.sort((a, b) => timeDateSorter(a, b, sortKey));
  let dataLabels = [];
  let temp = [];
  console.log("TempDataFetched: ", arr.length);
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
  console.log("TempDataFetched: ", arr.length);
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(arr[i][xKey]);
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
  console.log("AccDataFetched: ", arr.length);
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
  console.log("WaterDataFetched: ", arr.length);
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
  console.log(x);

  return x;
};

export const hexWithAlpha = (hex, alpha) => `${hex}${alpha}`;
