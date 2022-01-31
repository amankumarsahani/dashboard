/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { makeAccData, makeTempData, NumberAnimated } from "../utils.js";
import axios from "axios";
import { saveAs } from "file-saver";
import Refresh from "../icons/refresh.png";
import Search from "../components/Search.js";
import ReactChart from "../components/charts/ReactChart";
import moment from "moment";

function App() {
  const url =
    "https://rtvab1na8b.execute-api.us-west-2.amazonaws.com/default/fetchDynamoDBdata";
  const vw = (0.8 * window.innerWidth) / 100;
  const [refresh, setRefresh] = useState(false);
  const [accData, setAccData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [interv, setInterv] = useState(60);
  const [theme, setTheme] = useState(0);
  const searchRef = useRef(null);
  const accRef = useRef(null);
  const tempRef = useRef(null);

  const [searchId, setSearchId] = useState("c3:83:0c:de:ae:07");

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

  document.getElementById("intervalInput") &&
    (document.getElementById("intervalInput").oninput = function () {
      var value = ((this.value - this.min) / (this.max - this.min)) * 100;
      this.style.background =
        "linear-gradient(to right, #16a085 0%, #16a085 " +
        value +
        "%, #fff " +
        value +
        "%, #fff 100%)";
    });

  // document.getElementById("activeBar").style.width = `${
  //   accData && accData.dataLabels.length / accData.dataLabels.length
  // }%`;
  const loadBar = () => {
    if (document.querySelector("#activeBar")) {
      document.querySelector("#activeBar").style.width = `${accData && 50}%`;
    }
    if (document.querySelector("#s1g2c1 #activeBar")) {
      document.querySelector("#s1g2c1 #activeBar").style.width = `${
        accData && 50
      }%`;
    }
    if (document.querySelector("#s1g2c2 #activeBar")) {
      document.querySelector("#s1g2c2 #activeBar").style.width = `${
        accData && 50
      }%`;
    }
  };
  const [aaa, setAaa] = useState(0);
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

      <div id="sec1Header">
        <div>MY DASHBOARD</div>
        <div className="menu">
          <div className="menuTitle" onClick={() => setAaa(aaa ? 0 : 1)}>
            <span style={{ fontSize: vw * 0.9 }}>
              {aaa ? <span>&#9654;</span> : <span>&#9664;</span>}
            </span>
            &nbsp; EXPORT &nbsp;
          </div>
          <div
            className="menuItems"
            id="m0"
            style={{
              opacity: aaa ? 1 : 0,
              transform: `translateX(${10 * !aaa}px)`,
            }}
            onClick={() => setAaa(0)}
          >
            <div
              onClick={() => {
                if (!aaa) return;
                const canvasSave = searchRef.current.canvas;
                canvasSave &&
                  canvasSave.toBlob(function (blob) {
                    saveAs(
                      blob,
                      `Device_Id ${searchId} at ${
                        moment().format("L") + " " + moment().format("LTS")
                      }.png`
                    );
                  });
              }}
            >
              SEARCH
            </div>
            <div
              onClick={() => {
                if (!aaa) return;
                const canvasSave = tempRef.current.canvas;
                canvasSave &&
                  canvasSave.toBlob(function (blob) {
                    saveAs(blob, `Temperature ${new Date().toString()}.png`);
                  });
              }}
            >
              TEMPERATURE
            </div>
            <div
              onClick={() => {
                if (!aaa) return;
                const canvasSave = accRef.current.canvas;
                canvasSave &&
                  canvasSave.toBlob(function (blob) {
                    saveAs(blob, `Accelerometer ${new Date().toString()}.png`);
                  });
              }}
            >
              ACCELEROMETER
            </div>
          </div>
        </div>
      </div>
      <section className="sec1">
        <div id="s1g1" className="graph">
          <span className="counterText">Active &nbsp; Sensors</span>
          <div id="barAndCounter">
            <div id="totalBar" className="loadBar">
              <div id="activeBar" onLoad={loadBar()}></div>
            </div>
            <div id="activeTotalCounter" className="counter">
              <NumberAnimated
                data={
                  accData &&
                  tempData &&
                  accData.dataLabels.length + tempData.dataLabels.length
                }
              />
              /
              {accData &&
                tempData &&
                accData.dataLabels.length + tempData.dataLabels.length}
              {!accData && !tempData && "..."}
            </div>
          </div>
        </div>
        <div id="s1g2" className="graph">
          <div className="title">Sensors</div>
          <div id="s1g2c1">
            <span className="counterText">Accelerometer</span>
            <div id="barAndCounter">
              <div id="activeTotalCounter" className="counter">
                <NumberAnimated data={accData && accData.dataLabels.length} />/
                {accData && accData.dataLabels.length}
                {!accData && "..."}
              </div>
              <div id="totalBar" className="loadBar">
                <div id="activeBar" onLoad={loadBar()}></div>
              </div>
              <div id="activeTotalPercentage" className="counter">
                <NumberAnimated
                  data={
                    accData &&
                    (accData.dataLabels.length / accData.dataLabels.length) *
                      100
                  }
                />{" "}
                %
              </div>
            </div>
          </div>
          <div id="s1g2c2">
            <span className="counterText">Temperature</span>

            <div id="barAndCounter">
              <div id="activeTotalCounter" className="counter">
                <NumberAnimated data={tempData && tempData.dataLabels.length} />
                /{tempData && tempData.dataLabels.length}
                {!tempData && "..."}
              </div>
              <div id="totalBar" className="loadBar">
                <div id="activeBar" onLoad={loadBar()}></div>
              </div>
              <div id="activeTotalPercentage" className="counter">
                <NumberAnimated
                  data={
                    tempData &&
                    (tempData.dataLabels.length / tempData.dataLabels.length) *
                      100
                  }
                />{" "}
                %
              </div>
            </div>
          </div>
        </div>
        <div id="g2">
          <Search
            url={url}
            refresh={refresh}
            theme={theme}
            vw={vw}
            forwardedRef={searchRef}
            setSearchId={setSearchId}
          ></Search>
        </div>
      </section>

      <div id="sec2Header">ACCELEROMETER</div>
      <section className="sec2">
        <div id="s2g1" className="graph">
          {/* <div className="chartTitle">Accelerometer m/s{"\u00b2"}</div> */}
          {accData && (
            <ReactChart
              title={""}
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
              legendColor={theme ? "#00c3ff" : "#16a085"}
              fillArr={[false, false, false, true]}
              fontSize={vw}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              gridArr={[1, 1]}
              giveIndex={1}
              grad={1}
              forwardedRef={accRef}
            />
          )}
        </div>
        <div id="g4" className="graph"></div>
      </section>
      {/* <div id="g5" className="graph">
        <span>
          Refreshing every <span id="intervalText">{interv}</span> sec
        </span>
        <input
          id="intervalInput"
          type="range"
          min="1"
          max="60"
          step="1"
          value={interv}
          onChange={handleIntervalChange}
        />
      </div> */}
      <div id="sec3Header">TEMPERATURE</div>
      <section className="sec3">
        <div id="s3g1" className="graph">
          {/* <div className="chartTitle">Temperature ºC</div> */}
          {tempData && (
            <ReactChart
              title={""}
              xLabel={tempData.dataLabels}
              yLabelArr={["Temperature ºC         "]}
              yAxisIDArr={["y"]}
              yDataArr={[tempData.temp]}
              typeArr={["line"]}
              colorArr={["#ff006f"]}
              legendColor={theme ? "#00c3ff" : "#16a085"}
              fillArr={[true]}
              fontSize={vw}
              gridArr={[1, 1]}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              giveIndex={1}
              grad={1}
              forwardedRef={tempRef}
            />
          )}
        </div>
        <div id="s3g2" className="graph"></div>
      </section>
      <footer>developed by @ehsan__ulhaq</footer>
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
