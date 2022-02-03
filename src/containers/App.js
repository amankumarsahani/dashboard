// eslint-disable-next-line react-hooks/exhaustive-deps

import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { makeAccData, makeTempData, NumberAnimated } from "../utils.js";
import axios from "axios";
import { saveAs } from "file-saver";
import Refresh from "../icons/refresh.svg";
import Search from "../components/Search.js";
import ReactChart from "../components/charts/ReactChart";
import moment from "moment";
import { Loading, arrayEquals, draw3d } from "../utils.js";

function App() {
  const url =
    "https://rtvab1na8b.execute-api.us-west-2.amazonaws.com/default/fetchDynamoDBdata";
  const vw = (0.8 * window.innerWidth) / 100;
  const [refresh, setRefresh] = useState(false);
  const [accData, setAccData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [interv, setInterv] = useState(60);
  const [theme, setTheme] = useState(1);
  const searchRef = useRef(null);
  const accRef = useRef(null);
  const tempRef = useRef(null);
  const [accAvg, setAccAvg] = useState({});
  // const [tempAvg, setTempAvg] = useState({});
  const [searchId, setSearchId] = useState("c3:83:0c:de:ae:07");
  const [avgOrSel, setAvgOrSel] = useState(true);

  const [point1, setPoint1] = useState({});
  const [accPoint, setAccPoint] = useState({});
  const [refreshMenu, setRefreshMenu] = useState(false);

  useEffect(() => {
    if (!accData) return;
    setAvgOrSel(false);

    setAccPoint({
      l: accData.dataLabels[point1[0]],
      x: accData.dataX[point1[0]],
      y: accData.dataY[point1[0]],
      z: accData.dataZ[point1[0]],
      abs: accData.abs[point1[0]],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point1]);

  useEffect(() => {
    if (!accPoint) return;
    const cnv = document.getElementById("accCanvas");
    draw3d(cnv, accPoint.x, accPoint.y, accPoint.z);
  }, [accPoint]);

  useEffect(() => {
    if (!accData || !tempData) return;
    let len = accData.dataLabels.length;
    let avgX = 0;
    let avgY = 0;
    let avgZ = 0;
    let avgAbs = 0;
    accData.dataX.forEach((x) => (avgX += parseFloat(x)));
    accData.dataY.forEach((y) => (avgY += parseFloat(y)));
    accData.dataZ.forEach((z) => (avgZ += parseFloat(z)));
    accData.abs.forEach((abs) => (avgAbs += parseFloat(abs)));

    setAccAvg({
      avgX: [avgX / len],
      avgY: [avgY / len],
      avgZ: [avgZ / len],
      avgAbs: [avgAbs / len],
    });

    // len = tempData.dataLabels.length;
    // let avgTemp = 0;
    // tempData.temp.forEach((temp) => (avgTemp += parseFloat(temp)));
    // setTempAvg({
    //   avgTemp: [avgTemp / len],
    // });
  }, [accData, tempData]);

  useEffect(() => {
    setAvgOrSel(true);
    accAvg.avgX &&
      draw3d(
        document.getElementById("accCanvas"),
        accAvg.avgX[0],
        accAvg.avgY[0],
        accAvg.avgZ[0]
      );
  }, [accAvg]);

  const handleIntervalChange = (e) => {
    if (e.target.value > 60) setInterv(60);
    else if (e.target.value <= 0) setInterv(1);
    else setInterv(e.target.value);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  // document.getElementById("intervalInput") &&
  //   (document.getElementById("intervalInput").oninput = function () {
  //     var value = ((this.value - this.min) / (this.max - this.min)) * 100;
  //     this.style.background =
  //       "linear-gradient(to right, #16a085 0%, #16a085 " +
  //       value +
  //       "%, #fff " +
  //       value +
  //       "%, #fff 100%)";
  //   });

  // document.getElementById("activeBar").style.width = `${
  //   accData && accData.dataLabels.length / accData.dataLabels.length
  // }%`;
  const loadBar = () => {
    if (document.querySelector("#activeBar")) {
      if (!accData || !tempData) return;
      document.querySelector("#activeBar").style.width = `${
        ((accData.dataLabels.length + tempData.dataLabels.length) / (12 + 8)) *
        100
      }%`;
    }
    if (document.querySelector("#s1g2c1 #activeBar")) {
      document.querySelector("#s1g2c1 #activeBar").style.width = `${
        (accData.dataLabels.length / 12) * 100
      }%`;
    }
    if (document.querySelector("#s1g2c2 #activeBar")) {
      document.querySelector("#s1g2c2 #activeBar").style.width = `${
        (tempData.dataLabels.length / 8) * 100
      }%`;
    }
  };
  const [aaa, setAaa] = useState(0);
  return (
    <div className={`App ${theme ? "dark" : "light"}`}>
      <header className="App-header">
        <div>SENSOR &nbsp; NODE &nbsp; NETWORK</div>
        <div
          className="options"
          style={{
            width: `calc(var(--f0)*${refreshMenu ? "11" : "8"})`,
          }}
        >
          <div id="themeToggle" onClick={() => setTheme(!theme)}>
            <div>{/* div neccessary to size the themeToggle icon */}</div>
          </div>
          <div
            id="refreshHolder"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              id="refreshIcon"
              src={Refresh}
              alt="img"
              onClick={() => {
                setRefresh(!refresh);
                console.log("refreshed");
              }}
            ></img>
            <span
              id="refreshArrow"
              onClick={() => {
                setRefreshMenu(!refreshMenu);
              }}
            >
              {refreshMenu ? <>&#9664;</> : <>&#9654;</>}
            </span>
            <input
              style={{
                display: refreshMenu ? "inline" : "none",
              }}
              id="refreshInput"
              type="number"
              min="1"
              max="60"
              step="1"
              value={interv}
              onChange={handleIntervalChange}
            />
          </div>
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
              transform: `translateX(${-20 * aaa}px)`,
            }}
            onClick={() => setAaa(0)}
          >
            <div
              id="mi1"
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
              {searchId}
            </div>
            <div
              id="mi2"
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
              id="mi3"
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
          <div id="activeTotalCounter" className="counter">
            <div>
              <NumberAnimated
                data={
                  accData &&
                  tempData &&
                  accData.dataLabels.length + tempData.dataLabels.length
                }
              />
              /{12 + 8}
              {!accData && !tempData && "..."}
            </div>
            <div>
              <NumberAnimated
                data={
                  accData &&
                  tempData &&
                  ((accData.dataLabels.length + tempData.dataLabels.length) /
                    (12 + 8)) *
                    100
                }
              />
              %
            </div>
          </div>
          <div id="totalBar" className="loadBar">
            <div id="activeBar" onLoad={loadBar()}></div>
          </div>
        </div>
        <div id="s1g2" className="graph">
          <div className="title">Sensors</div>
          <div id="s1g2c1">
            <span className="counterText">Accelerometer</span>
            <div id="barAndCounter">
              <div id="activeTotalCounter" className="counter">
                <NumberAnimated data={accData && accData.dataLabels.length} />/
                {accData && 12}
                {!accData && "..."}
              </div>
              <div id="totalBar" className="loadBar">
                <div id="activeBar" onLoad={loadBar()}></div>
              </div>
              <div id="activeTotalPercentage" className="counter">
                <NumberAnimated
                  data={accData && (accData.dataLabels.length / 12) * 100}
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
                /{tempData && 8}
                {!tempData && "..."}
              </div>
              <div id="totalBar" className="loadBar">
                <div id="activeBar" onLoad={loadBar()}></div>
              </div>
              <div id="activeTotalPercentage" className="counter">
                <NumberAnimated
                  data={tempData && (tempData.dataLabels.length / 8) * 100}
                />
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
            dropdownOptions={[
              accData && accData.dataLabels,
              tempData && tempData.dataLabels,
            ]}
          ></Search>
        </div>
      </section>

      <div id="sec2Header">ACCELEROMETER</div>
      <section className="sec2">
        <div id="s2g1" className="graph">
          {/* <div className="chartTitle">Accelerometer m/s{"\u00b2"}</div> */}
          {!accData ? (
            <Loading theme={theme} />
          ) : (
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
              legendColor={theme ? "#00c3ff" : "#8676ff"}
              fillArr={[false, false, false, true]}
              fontSize={vw}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              gridArr={[1, 1]}
              giveIndex={1}
              grad={1}
              forwardedRef={accRef}
              setPoint={setPoint1}
              clickable={false}
            />
          )}
        </div>
        <div id="s2g2" className="graph">
          <div className="title">
            {avgOrSel ? <span>{"Average"}</span> : <span>{accPoint.l}</span>}
            {!avgOrSel && (
              <span
                id="button"
                onClick={() => {
                  setAvgOrSel(true);
                  accAvg.avgX &&
                    draw3d(
                      document.getElementById("accCanvas"),
                      accAvg.avgX[0],
                      accAvg.avgY[0],
                      accAvg.avgZ[0]
                    );
                }}
              >
                average
              </span>
            )}
          </div>
          <div className="avgData">
            <span>Magnitude :</span>
            <span className="computed">
              {avgOrSel
                ? accAvg.avgAbs && accAvg.avgAbs[0].toFixed(3)
                : accPoint.abs && accPoint.abs.toFixed(3)}{" "}
              m/s{"\u00b2"}
            </span>
            <span>
              <span
                className={`arrow ${
                  avgOrSel
                    ? accAvg.avgAbs && accAvg.avgAbs[0] > 9.801
                      ? "up"
                      : "down"
                    : accPoint.abs > 9.801
                    ? "up"
                    : "down"
                }`}
              >
                {avgOrSel ? (
                  accAvg.avgAbs && accAvg.avgAbs[0] > 9.801 ? (
                    <span>&#9650;</span>
                  ) : (
                    <span>&#9660;</span>
                  )
                ) : accPoint.abs > 9.801 ? (
                  <span>&#9650;</span>
                ) : (
                  <span>&#9660;</span>
                )}
                &nbsp;
              </span>
              <span className="computed">
                {avgOrSel
                  ? accAvg.avgAbs &&
                    (((9.801 - accAvg.avgAbs[0]) / 9.801) * 100).toFixed(1)
                  : ((Math.abs(9.801 - accPoint.abs) / 9.801) * 100).toFixed(1)}
                %
              </span>
            </span>
            <span id="x">X-axis : &nbsp; &nbsp; &nbsp; &nbsp;</span>
            <span id="xc" className="computed">
              {avgOrSel ? accAvg.avgX && accAvg.avgX[0].toFixed(3) : accPoint.x}{" "}
              m/s{"\u00b2"}
            </span>
            <span id="y"> Y-axis : &nbsp;</span>
            <span id="yc" className="computed">
              {avgOrSel ? accAvg.avgY && accAvg.avgY[0].toFixed(3) : accPoint.y}{" "}
              m/s{"\u00b2"}
            </span>
            <span id="z"> Z-axis : &nbsp; &nbsp; &nbsp; &nbsp;</span>
            <span id="zc" className="computed">
              {avgOrSel ? accAvg.avgZ && accAvg.avgZ[0].toFixed(3) : accPoint.z}{" "}
              m/s{"\u00b2"}
            </span>
            <canvas id="accCanvas"></canvas>
          </div>

          {/* {accAvg && accAvg.avgAbs && (
            <ReactChart
              title={`${accAvg.avgAbs[0].toFixed(3)} m/s\u00b2`}
              titleAlign={"center"}
              xLabel={["Average"]}
              yLabelArr={[
                "X-axis         ",
                "Y-axis         ",
                "Z-axis         ",
                "Magnitude         ",
              ]}
              yAxisIDArr={["y", "y", "y", "y"]}
              yDataArr={[accAvg.avgX, accAvg.avgY, accAvg.avgZ, accAvg.avgAbs]}
              typeArr={["bar", "bar", "bar", "bar"]}
              colorArr={["#ff006f", "#f5a7a0", "#0fc26c", "#0062ff"]}
              legend={false}
              legendColor={theme ? "#00c3ff" : "#8676ff"}
              fillArr={[false, false, false, true]}
              fontSize={vw}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              gridArr={[1, 1]}
              giveIndex={0}
              grad={1}
              offset={true}
            />
          )} */}
        </div>
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
          {!tempData ? (
            <Loading theme={theme} />
          ) : (
            <ReactChart
              title={""}
              xLabel={tempData.dataLabels}
              yLabelArr={["Temperature ºC         "]}
              yAxisIDArr={["y"]}
              yDataArr={[tempData.temp]}
              typeArr={["line"]}
              colorArr={["#ff006f"]}
              legendColor={theme ? "#00c3ff" : "#8676ff"}
              fillArr={[true]}
              fontSize={vw}
              gridArr={[1, 1]}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              giveIndex={1}
              grad={1}
              forwardedRef={tempRef}
              clickable={false}
            />
          )}
        </div>
        <div id="s3g2" className="graph">
          {/* <div className="title">Canvas</div> */}

          {/* {tempAvg && tempAvg.avgTemp && (
            <ReactChart
              title={`${tempAvg.avgTemp[0].toFixed(3)} ºC`}
              titleAlign={"center"}
              xLabel={["Average"]}
              yLabelArr={["Temperature ºC         "]}
              yAxisIDArr={["y"]}
              yDataArr={[tempAvg.avgTemp]}
              typeArr={["bar"]}
              colorArr={["#ff006f"]}
              legend={false}
              legendColor={theme ? "#00c3ff" : "#8676ff"}
              fillArr={[true]}
              fontSize={vw}
              gridArr={[1, 1]}
              gridColor={theme ? "#ffffff11" : "#00000022"}
              giveIndex={0}
              grad={1}
              offset={true}
            />
          )} */}
        </div>
      </section>
      {/* <footer>developed by @ehsan__ulhaq</footer> */}
    </div>
  );
}

export default App;
