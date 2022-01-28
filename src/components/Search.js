/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useState, useEffect } from "react";
import ReactChart from "./charts/ReactChart";
import "./Search.css";
import { makeAccDataFromQuery, makeTempDataFromQuery } from "../utils.js";

export default function Search({ url, refresh, theme, vw }) {
  const [searchField, setSearchField] = useState("");
  const [id, setId] = useState("c3:83:0c:de:ae:07");
  const [searchLim, setSearchLim] = useState(10);
  const [lim, setLim] = useState(10);
  const [accOrTempData, setAccOrTempData] = useState("");
  const [sensor, setSensor] = useState("");
  const [pr, setPr] = useState(0);

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

  useEffect(() => {
    axios.get(url + "?id=" + id + "&lim=" + lim).then((response) => {
      if (response !== []) {
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
      }
    });
  }, [id, url, refresh, lim]);

  document.getElementById("lim") &&
    (document.getElementById("lim").oninput = function () {
      var value = ((this.value - this.min) / (this.max - this.min)) * 100;
      this.style.background =
        "linear-gradient(to right, #82CFD0 0%, #82CFD0 " +
        value +
        "%, #fff " +
        value +
        "%, white 100%)";
    });

  return (
    <div id="SearchContainer">
      <div id="searchHeader">
        <div id="searchTitle">Search Device</div>
        <form id="searchForm" onSubmit={handleSubmit}>
          <div id="s1">
            <span>Device ID :</span>
            <input
              id="searchFormInput"
              type="text"
              value={searchField}
              placeholder={id}
              onChange={handleSearchChange}
            />
            <input id="searchFormSubmit" type="submit" value="Submit" />
            <span>{lim}</span>
          </div>

          <input
            id="lim"
            type="range"
            min="1"
            max="100"
            value={searchLim}
            onChange={handleLimChange}
          />
        </form>
      </div>
      <div className="searchResult">
        <div className="searchData">
          {accOrTempData &&
            accOrTempData[sensor === "acc" ? "abs" : "temp"] &&
            parseFloat(
              accOrTempData[sensor === "acc" ? "abs" : "temp"][
                accOrTempData[sensor === "acc" ? "abs" : "temp"].length - 1
              ]
            ).toFixed(2)}
          &nbsp; {sensor === "acc" ? " m/s\u00b2" : " ºC"}
        </div>
        {sensor === "acc" &&
          accOrTempData.abs &&
          accOrTempData.abs.length !== 0 && (
            <div
              className="searchChart"
              onClick={() => {
                setPr(!pr);
              }}
            >
              <ReactChart
                title={"Accelerometer"}
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
                fillArr={[false, false, false, true]}
                fontSize={vw}
                gridColor={theme ? "#ffffff11" : "#00000022"}
                pr={pr}
              />
            </div>
          )}
        {sensor === "temp" &&
          accOrTempData.temp &&
          accOrTempData.temp.length !== 0 && (
            <div className="searchChart">
              <ReactChart
                title={"Temperature"}
                xLabel={accOrTempData.dataLabels}
                yLabelArr={["Temperature ºC         "]}
                yAxisIDArr={["y"]}
                yDataArr={[accOrTempData.temp]}
                typeArr={["bar"]}
                colorArr={["#ff006f"]}
                fillArr={[true]}
                fontSize={vw}
                gridColor={theme ? "#ffffff11" : "#00000022"}
                pr={pr[0]}
              />
            </div>
          )}
      </div>
    </div>
  );
}

function arrayEquals(a, b) {
  console.log(
    Array.isArray(a),
    Array.isArray(b),
    a.length === b.length,
    a.every((val, index) => val === b[index])
  );
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}
