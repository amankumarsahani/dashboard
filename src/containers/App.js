/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React, { useState, useEffect } from "react";
import { makeAccData, makeTempData } from "../utils.js";
import axios from "axios";
import Dropdown from "../components/Dropdown.js";
import Refresh from "../icons/refresh.png";
import DeviceCounter from "../components/DeviceCounter.js";
import Search from "../components/Search.js";
import ReactChart from "../components/charts/ReactChart";

function App() {
  const url =
    "https://rtvab1na8b.execute-api.us-west-2.amazonaws.com/default/fetchDynamoDBdata";
  const vw = (0.8 * window.innerWidth) / 100;
  const [refresh, setRefresh] = useState(false);
  const [accData, setAccData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [interv, setInterv] = useState(60);
  const [theme, setTheme] = useState(1);
  const [pr, setPr] = useState([0, 0]);

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

  const handleNewResponse = (response) => {
    let ad = makeAccData(response.data.acc);
    let td = makeTempData(response.data.temp);
    if (
      !arrayEquals(ad.dataLabels, accData.dataLabels) ||
      !arrayEquals(ad.dataX, accData.dataX) ||
      !arrayEquals(ad.dataY, accData.dataY) ||
      !arrayEquals(ad.dataZ, accData.dataZ)
    ) {
      setAccData(ad);
    }
    if (
      !arrayEquals(td.dataLabels, tempData.dataLabels) ||
      !arrayEquals(td.temp, tempData.temp)
    ) {
      setTempData(td);
    }
  };

  useEffect(() => {
    axios.get(url).then((response) => {
      if (!accData || !tempData) {
        if (!accData) setAccData(makeAccData(response.data.acc));
        if (!tempData) setTempData(makeTempData(response.data.temp));
      } else handleNewResponse(response);
    });
  }, [refresh]);

  return (
    <div className={`App ${theme ? "dark" : "light"}`}>
      <header className="App-header">
        <div>SENSOR &nbsp; NODE &nbsp; NETWORK</div>
        <div className="options">
          <div id="themeToggle" onClick={() => setTheme(!theme)}>
            <div>{/* div neccessary to size the themeToggle icon */}</div>
          </div>
          <img
            id="refresh"
            src={Refresh}
            alt="img"
            onClick={() => {
              setRefresh(!refresh);
              console.log("refreshed");
            }}
          ></img>
          {/* <Dropdown /> */}
        </div>
      </header>
      <div className="graphHolder">
        <div id="g1" className="graph">
          <div className="counterDiv">
            <span className="counterText">Active Accelerometer Sensors</span>
            <div className="counter">
              <DeviceCounter data={accData && accData.dataLabels.length} />
            </div>
          </div>
          <div className="counterDiv">
            <span className="counterText">Active Temperature Sensors</span>
            <div className="counter">
              <DeviceCounter data={tempData && tempData.dataLabels.length} />
            </div>
          </div>
        </div>
        <div id="g2" className="graph">
          <Search url={url} refresh={refresh} theme={theme} vw={vw}></Search>
        </div>
        <div id="g3" className="graph" onClick={() => setPr([!pr[0], pr[1]])}>
          <div className="chartTitle">Temperature ºC</div>
          {tempData && (
            <ReactChart
              title={"Temperature"}
              xLabel={tempData.dataLabels}
              yLabelArr={["Temperature ºC         "]}
              yAxisIDArr={["y"]}
              yDataArr={[tempData.temp]}
              typeArr={["line"]}
              colorArr={["#ff006f"]}
              fillArr={[true]}
              fontSize={vw}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              pr={pr[0]}
              giveIndex={1}
            />
          )}
        </div>
        <div id="g4" className="graph" onClick={() => setPr([pr[0], !pr[1]])}>
          <div className="chartTitle">Accelerometer m/s{"\u00b2"}</div>
          {accData && (
            <ReactChart
              title={"Accelerometer"}
              xLabel={accData.dataLabels}
              yLabelArr={[
                "X-axis         ",
                "Y-axis         ",
                "Z-axis         ",
                "Magnitude         ",
              ]}
              yAxisIDArr={["y", "y", "y", "y"]}
              yDataArr={[
                accData.dataX,
                accData.dataY,
                accData.dataZ,
                accData.abs,
              ]}
              typeArr={["line", "line", "line", "line"]}
              colorArr={["#ff006f", "#f5a7a0", "#0fc26c", "#0062ff"]}
              fillArr={[false, false, false, true]}
              fontSize={vw}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              pr={pr[1]}
              giveIndex={1}
            />
          )}
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

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}
