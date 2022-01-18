import "./App.css";
import Chart1 from "./components/charts/Chart1.js";
import Chart2 from "./components/charts/Chart2.js";
import Chart3 from "./components/charts/Chart3.js";
import Chart4 from "./components/charts/Chart4.js";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const url =
    "https://rtvab1na8b.execute-api.us-west-2.amazonaws.com/default/fetchDynamoDBdata";

  const [accData, setAccData] = useState(null);
  const [airData, setAiData] = useState(null);

  useEffect(() => {
    const loop = false;
    const interval = 5000;
    if (loop) {
      const intervalId = setInterval(() => {
        axios.get(url).then((response) => {
          setAccData(makeAccData(response.data.acc));
          setAiData(makeAirData(response.data.air));
        });
      }, interval);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      axios.get(url).then((response) => {
        setAccData(makeAccData(response.data.acc));
        setAiData(makeAirData(response.data.air));
      });
    }
  }, [url]);

  return (
    <div className="App">
      <header className="App-header">
        <div>Data Analysis</div>
        <div>About</div>
      </header>
      <div className="graphHolder">
        <div className="graph">
          <Chart1 data={accData}></Chart1>
        </div>
        <div className="graph">
          <Chart2 data={airData}></Chart2>
        </div>
        <div className="graph">
          <Chart3></Chart3>
        </div>
        <div className="graph">
          <Chart4 data={airData}></Chart4>
        </div>
      </div>
    </div>
  );
}

export default App;

function makeAccData(arr) {
  arr.sort((_a, _b) => {
    let a = _a.TimestampUTC;
    let b = _b.TimestampUTC;

    let p = toDate(a);
    let q = toDate(b);
    if (p < q) return -1;
    else if (p > q) return 1;
    return 0;
  });
  let dataLabels = [];
  let dataX = [];
  let dataY = [];
  let dataZ = [];
  console.log(arr.length);
  for (let i = 0; i < arr.length; i++) {
    let t = toDate(arr[i].TimestampUTC).toLocaleDateString("en-IN");
    dataLabels.push(t);
    let val = arr[i].Value;
    let x = val.substring(6, 8) + val.substring(4, 6);
    let y = val.substring(10, 12) + val.substring(8, 10);
    let z = val.substring(14, 16) + val.substring(12, 14);
    x = signedHexToDec(parseInt(x, 16)) * 0.00245;
    y = signedHexToDec(parseInt(y, 16)) * 0.00245;
    z = signedHexToDec(parseInt(z, 16)) * 0.00245;
    dataX.push(x);
    dataY.push(y);
    dataZ.push(z);
  }
  return { dataLabels, dataX, dataY, dataZ };
}

function makeAirData(arr) {
  arr.sort(timeDateSorter);
  let dataLabels = [];
  let data = { temp: [], humi: [], pm10: [], pm25: [], pm40: [], pm100: [] };
  for (let i = 0; i < arr.length; i++) {
    let t = toDate(arr[i].TimeStamp).toLocaleDateString("en-IN");
    dataLabels.push(t);
    if (arr[i].Temperature < -100 || arr[i].Temperature > 100)
      data.temp.push(0);
    else data.temp.push(arr[i].Temperature);
    if (arr[i].Humidity < -100 || arr[i].Humidity > 100) data.humi.push(0);
    else data.humi.push(arr[i].Humidity);
    if (arr[i].PM10 > 100) data.pm10.push(0);
    else data.pm10.push(arr[i].PM10);
    if (arr[i].PM25 > 100) data.pm25.push(0);
    else data.pm25.push(arr[i].PM25);
    if (arr[i].PM40 > 100) data.pm40.push(0);
    else data.pm40.push(arr[i].PM40);
    if (arr[i].PM100 > 100) data.pm100.push(0);
    else data.pm100.push(arr[i].PM100);
  }
  return { dataLabels, data };
}

function toDate(a) {
  a = a.substring(3, 6) + a.substring(0, 3) + a.substring(6);
  return new Date(a);
}
function timeDateSorter(_a, _b) {
  let a = _a.TimeStamp;
  let b = _b.TimeStamp;

  let p = toDate(a);
  let q = toDate(b);
  if (p < q) return -1;
  else if (p > q) return 1;
  return 0;
}

function signedHexToDec(sigHex) {
  return -(sigHex & 0x8000) | (sigHex & 0x7fff);
}
