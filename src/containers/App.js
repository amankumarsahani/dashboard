import "./App.css";
import Chart1 from "../components/charts/Chart1.js";
import Chart2 from "../components/charts/Chart2.js";
import Chart3 from "../components/charts/Chart3.js";
import Chart4 from "../components/charts/Chart4.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "../components/Dropdown.js";
import Refresh from "../icons/refresh.png";

function App() {
  const url =
    "https://rtvab1na8b.execute-api.us-west-2.amazonaws.com/default/fetchDynamoDBdata";
  const [refresh, setRefresh] = useState(false);
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
  }, [refresh]);
  return (
    <div className="App">
      <header className="App-header">
        <div>Data Analysis</div>
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
              console.log(refresh);
            }}
          ></img>
          <Dropdown />
        </div>
      </header>
      <div className="graphHolder">
        <div className="graph">
          <Chart1 data={accData}></Chart1>
        </div>
        <div className="graph">
          <Chart2 data={airData}></Chart2>
        </div>
        <div className="graph">
          <Chart3 data={airData}></Chart3>
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
  arr.sort((a, b) => timeDateSorter(a, b, "TimestampUTC"));
  let dataLabels = [];
  let dataX = [];
  let dataY = [];
  let dataZ = [];
  console.log(arr.length);
  for (let i = 0; i < arr.length; i++) {
    //time axis
    dataLabels.push(toDate(arr[i].TimestampUTC).toLocaleDateString("en-IN"));
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
  arr.sort((a, b) => timeDateSorter(a, b, "TimeStamp"));
  let dataLabels = [];
  let data = {
    temp: [],
    humi: [],
    pm10: [],
    pm25: [],
    pm40: [],
    pm100: [],
    co2: [],
  };
  for (let i = 0; i < arr.length; i++) {
    //time axis
    dataLabels.push(toDate(arr[i].TimeStamp).toLocaleDateString("en-IN"));

    //data for Chart 2
    data.temp.push(Math.abs(arr[i].Temperature) > 100 ? 0 : arr[i].Temperature);
    data.humi.push(Math.abs(arr[i].Humidity) > 100 ? 0 : arr[i].Humidity);

    //data for Chart 3 and Chart 4
    data.pm10.push(arr[i].PM10 > 100 ? 0 : arr[i].PM10);
    data.pm25.push(arr[i].PM25 > 100 ? 0 : arr[i].PM25);
    data.pm40.push(arr[i].PM40 > 100 ? 0 : arr[i].PM40);
    data.pm100.push(arr[i].PM100 > 100 ? 0 : arr[i].PM100);
    data.co2.push(Math.abs(arr[i].CO2) > 100000 ? 0 : arr[i].CO2);
  }
  return { dataLabels, data };
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

function signedHexToDec(sigHex) {
  return -(sigHex & 0x8000) | (sigHex & 0x7fff);
}
