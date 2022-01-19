import "./App.css";
import TempChart from "../components/charts/TempChart.js";
import AccData from "../components/charts/AccData.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "../components/Dropdown.js";
import Refresh from "../icons/refresh.png";
import DeviceCounter from "../components/DeviceCounter.js";

function App() {
  const url =
    "https://rtvab1na8b.execute-api.us-west-2.amazonaws.com/default/fetchDynamoDBdata";
  const [refresh, setRefresh] = useState(false);
  const [accData, setAccData] = useState(null);
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    const loop = false;
    const interval = 5000;
    if (loop) {
      const intervalId = setInterval(() => {
        axios.get(url).then((response) => {
          setAccData(makeAccData(response.data.acc));
          setTempData(makeTempData(response.data.temp));
        });
      }, interval);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      axios.get(url).then((response) => {
        setAccData(makeAccData(response.data.acc));
        setTempData(makeTempData(response.data.temp));
      });
    }
  }, [refresh]);
  return (
    <div className="App">
      <header className="App-header">
        <div>SENSOR &nbsp; NODE &nbsp; NETWORK</div>
        <div className="Options">
          <img
            id="refresh"
            src={Refresh}
            alt="img"
            style={{
              height: "2.2rem",
              filter:
                "invert(48%) sepia(13%) saturate(3207%) hue-rotate(171deg) brightness(95%) contrast(80%)",
            }}
            onClick={() => {
              setRefresh(!refresh);
              console.log("refreshed");
            }}
          ></img>
          <Dropdown />
        </div>
      </header>
      <div className="graphHolder">
        <div id="g1" className="graph">
          <span id="counterText1">Active Accelerometer Sensors</span>
          <div id="counter1">
            <DeviceCounter data={accData && accData.dataLabels.length} />
          </div>
          <span id="counterText2">Active Temperature Sensors</span>
          <div id="counter2">
            <DeviceCounter
              id="counter2"
              data={tempData && tempData.dataLabels.length}
            />
          </div>
        </div>
        <div id="g2" className="graph"></div>
        <div id="g3" className="graph">
          <TempChart data={tempData}></TempChart>
        </div>
        <div id="g4" className="graph">
          <AccData data={accData}></AccData>
        </div>
        <div id="g5" className="graph"></div>
      </div>
    </div>
  );
}

export default App;

function makeAccData(arr) {
  arr.sort((a, b) => timeDateSorter(a, b, "time_stmp"));
  let dataLabels = [];
  let dataX = [];
  let dataY = [];
  let dataZ = [];
  let abs = [];
  console.log(arr.length);
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(arr[i].DeviceID);
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

function makeTempData(arr) {
  arr.sort((a, b) => timeDateSorter(a, b, "time_stmp"));
  let dataLabels = [];
  let temp = [];
  console.log(arr.length);
  for (let i = 0; i < arr.length; i++) {
    dataLabels.push(arr[i].DeviceID);
    temp.push(
      Math.abs(arr[i].Temperature_degC) > 100 ? 0 : arr[i].Temperature_degC
    );
  }
  return { dataLabels, temp };
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
