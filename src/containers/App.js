import "./App.css";
import React, { useState, useEffect } from "react";
import { makeAccData, makeTempData } from "../utils.js";
import TempChart from "../components/charts/TempChart.js";
import AccChart from "../components/charts/AccChart.js";
import axios from "axios";
import Dropdown from "../components/Dropdown.js";
import Refresh from "../icons/refresh.png";
import DeviceCounter from "../components/DeviceCounter.js";
import Search from "../components/Search.js";

function App() {
  // const url =
  //   "https://rtvab1na8b.execute-api.us-west-2.amazonaws.com/default/fetchDynamoDBdata";
  const url = "https://o0qpbhstj6.execute-api.ap-south-1.amazonaws.com/GetData";
  const [refresh, setRefresh] = useState(false);
  const [accData, setAccData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [interv, setInterv] = useState(60);
  const [theme, setTheme] = useState(1);

  const type1 = {
    dataX: "line",
    dataY: "line",
    dataZ: "line",
    abs: "bar",
  };
  const body = document.getElementsByClassName("App");
  const changeTheme = () => {
    setTheme(!theme);
  };

  const handleIntervalChange = (e) => {
    setInterv(e.target.value);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefresh(!refresh);
    }, interv * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [interv, refresh]);

  useEffect(() => {
    axios.get(url).then((response) => {
      setAccData(makeAccData(response.data.acc));
      setTempData(makeTempData(response.data.temp));
    });
  }, [refresh]);
  return (
    <div className={`App ${theme ? "dark" : "light"}`}>
      <header className="App-header">
        <div>SENSOR &nbsp; NODE &nbsp; NETWORK</div>
        <div className="options">
          <div id="themeToggle" onClick={changeTheme}>
            <div></div>
          </div>
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
        <div id="g2" className="graph">
          <Search url={url} refresh={refresh}></Search>
        </div>
        <div id="g3" className="graph">
          <TempChart data={tempData}></TempChart>
        </div>
        <div id="g4" className="graph">
          <AccChart type={type1} data={accData}></AccChart>
        </div>
        <div id="g5" className="graph">
          <span>
            Refreshing every <span id="intervalText">{interv}</span> seconds
          </span>
          <input
            id="intervalInput"
            type="range"
            min="1"
            max="60"
            value={interv}
            onChange={handleIntervalChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
