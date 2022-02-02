/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactChart from "./charts/ReactChart";
import "./Search.css";
import {
  makeAccDataFromQuery,
  makeTempDataFromQuery,
  Loading,
  arrayEquals,
} from "../utils.js";

export default function Search({
  url,
  refresh,
  theme,
  vw,
  forwardedRef,
  setSearchId,
}) {
  const [searchField, setSearchField] = useState("");
  const [id, setId] = useState("c3:83:0c:de:ae:07");
  const [searchLim, setSearchLim] = useState(10);
  const [lim, setLim] = useState(10);
  const [accOrTempData, setAccOrTempData] = useState("");
  const [sensor, setSensor] = useState("");
  const [responded, setResponded] = useState(true);

  const handleSearchChange = (e) => {
    setSearchField(e.target.value);
  };
  const handleLimChange = (e) => {
    setSearchLim(e.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchField.length === 17) setId(searchField);
    setLim(searchLim);
  };

  const handleNewResponse = (response) => {
    if (sensor === "acc") {
      if (response.data.accOrTemp[0].Sensor === "Accelerometer") {
        let atd = makeAccDataFromQuery(response.data.accOrTemp, "time_stmp");
        if (
          !arrayEquals(atd.dataLabels, accOrTempData.dataLabels) ||
          !arrayEquals(atd.abs, accOrTempData.abs) ||
          !arrayEquals(atd.dataY, accOrTempData.dataY) ||
          !arrayEquals(atd.dataZ, accOrTempData.dataZ)
        ) {
          setAccOrTempData(atd);
        }
      } else {
        let atd = makeTempDataFromQuery(response.data.accOrTemp, "time_stmp");
        setSensor("temp");
        setAccOrTempData(atd);
      }
    } else {
      if (response.data.accOrTemp[0].Sensor === "Temperature") {
        let atd = makeTempDataFromQuery(response.data.accOrTemp, "time_stmp");
        if (
          !arrayEquals(atd.dataLabels, accOrTempData.dataLabels) ||
          !arrayEquals(atd.temp, accOrTempData.temp)
        ) {
          setAccOrTempData(atd);
        }
      } else {
        let atd = makeAccDataFromQuery(response.data.accOrTemp, "time_stmp");
        setSensor("acc");
        setAccOrTempData(atd);
      }
    }
  };
  const [prev, setPrev] = useState("c3:83:0c:de:ae:07");

  useEffect(() => {
    setResponded(false);
    axios.get(url + "?id=" + id + "&lim=" + lim).then((response) => {
      if (response.data.accOrTemp.length !== 0) {
        if (!accOrTempData) {
          if (response.data.accOrTemp[0].Sensor === "Accelerometer") {
            setSensor("acc");
            setAccOrTempData(
              makeAccDataFromQuery(response.data.accOrTemp, "time_stmp")
            );
          } else if (response.data.accOrTemp[0].Sensor === "Temperature") {
            setSensor("temp");
            setAccOrTempData(
              makeTempDataFromQuery(response.data.accOrTemp, "time_stmp")
            );
          }
        } else handleNewResponse(response);
        setPrev(id);
        setSearchId(id);
      }
      setResponded(true);
    });
  }, [id, url, refresh, lim]);

  document.getElementById("lim") &&
    (document.getElementById("lim").oninput = function () {
      var value = ((this.value - this.min) / (this.max - this.min)) * 100;
      this.style.background =
        "linear-gradient(to right, #16a085 0%, #16a085 " +
        value +
        "%, #fff " +
        value +
        "%, #fff 100%)";
    });

  return (
    <div id="SearchContainer">
      <div className="searchResult">
        {!accOrTempData.dataLabels && <Loading theme={theme} />}
        {sensor === "acc" &&
          accOrTempData.abs &&
          accOrTempData.abs.length !== 0 && (
            <div className="searchChart">
              <ReactChart
                title={`Accelerometer      ID : ${prev}`}
                xLabel={accOrTempData.dataLabels}
                yLabelArr={["X-axis", "Y-axis", "Z-axis", "Magnitude"]}
                yAxisIDArr={["y", "y", "y", "y"]}
                yDataArr={[
                  accOrTempData.dataX,
                  accOrTempData.dataY,
                  accOrTempData.dataZ,
                  accOrTempData.abs,
                ]}
                typeArr={
                  lim > 1
                    ? ["line", "line", "line", "line"]
                    : ["bar", "bar", "bar", "bar"]
                }
                colorArr={["#ff006f", "#f5a7a0", "#0fc26c", "#0062ff"]}
                legendColor={theme ? "#00c3ff" : "#8676ff"}
                fillArr={[false, false, false, true]}
                fontSize={vw}
                gridArr={[0, 1]}
                gridColor={theme ? "#ffffff11" : "#00000022"}
                offset={true}
                forwardedRef={forwardedRef}
              />
            </div>
          )}
        {sensor === "temp" &&
          accOrTempData.temp &&
          accOrTempData.temp.length !== 0 && (
            <div className="searchChart">
              <ReactChart
                title={`Temperature      ID : ${prev}`}
                xLabel={accOrTempData.dataLabels}
                yLabelArr={["Temperature ºC         "]}
                yAxisIDArr={["y"]}
                yDataArr={[accOrTempData.temp]}
                typeArr={lim > 10 ? ["line"] : ["bar"]}
                colorArr={["#ff006f"]}
                legend={false}
                legendColor={theme ? "#00c3ff" : "#8676ff"}
                fillArr={[true]}
                fontSize={vw}
                gridArr={[0, 1]}
                gridColor={theme ? "#ffffff11" : "#00000022"}
                offset={true}
                forwardedRef={forwardedRef}
              />
            </div>
          )}
      </div>
      <div id="searchHeader">
        <div id="searchTitle">
          <span>Search Device</span>
          {!responded && (
            <span className="loading">
              <Loading theme={theme} height={24} width={24} />
            </span>
          )}
        </div>
        <form id="searchForm" onSubmit={handleSubmit}>
          <div id="searchFormID">
            <span>
              Device ID <span style={{ fontSize: vw * 0.8 }}> &#9660;</span>
            </span>
            <input
              id="lim"
              type="range"
              min="1"
              max="100"
              value={searchLim}
              onChange={handleLimChange}
            />
            <span id="limCounter">{lim}</span>
          </div>
          <input
            id="searchFormInput"
            type="text"
            value={searchField}
            placeholder={prev}
            onChange={handleSearchChange}
          />

          <input id="searchFormSubmit" type="submit" value="Submit" />
          <div className="searchData">
            <div>
              <span>Time :</span>
              <span>
                {accOrTempData &&
                  accOrTempData.dataLabels &&
                  accOrTempData.dataLabels[accOrTempData.dataLabels.length - 1]}
              </span>
            </div>
            <div>
              <span>Live Value :</span>
              <span>
                {accOrTempData &&
                  accOrTempData[sensor === "acc" ? "abs" : "temp"] &&
                  parseFloat(
                    accOrTempData[sensor === "acc" ? "abs" : "temp"][
                      accOrTempData[sensor === "acc" ? "abs" : "temp"].length -
                        1
                    ]
                  ).toFixed(2)}
                &nbsp; {sensor === "acc" ? " m/s\u00b2" : " ºC"}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
