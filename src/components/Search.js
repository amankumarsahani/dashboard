import axios from "axios";
import React, { useState, useEffect } from "react";
import AccChart from "./charts/AccChart";
import TempChart from "./charts/TempChart";
import "./Search.css";
import {
  makeAccData,
  makeTempData,
  makeAccDataFromQuery,
  makeTempDataFromQuery,
} from "../utils.js";

export default function Search({ url, refresh, theme }) {
  const [searchField, setSearchField] = useState("");
  const [id, setId] = useState("c3:83:0c:de:ae:07");
  const [searchLim, setSearchLim] = useState(10);
  const [lim, setLim] = useState(10);
  const [accOrTempData, setAccOrTempData] = useState("");
  const [sensor, setSensor] = useState("");

  const type = {
    dataX: "bar",
    dataY: "bar",
    dataZ: "bar",
    abs: "bar",
  };

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

  useEffect(() => {
    axios
      .get(url + "?id=" + id + "&lim=" + lim)
      .then((response) => {
        if (response !== []) {
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
        }
      })
      .catch((err) => console.error(err));
  }, [id, url, refresh, lim]);

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
      {sensor === "acc" && accOrTempData.abs && accOrTempData.abs.length !== 0 && (
        <div className="searchResult">
          <div className="searchData">
            {parseFloat(
              accOrTempData.abs[accOrTempData.abs.length - 1]
            ).toFixed(2)}
            &nbsp;m/s
            {"\u00b2"}
          </div>
          <div className="searchChart">
            <AccChart data={accOrTempData} type={type} theme={theme}></AccChart>
          </div>
        </div>
      )}
      {sensor === "temp" &&
        accOrTempData.temp &&
        accOrTempData.temp.length !== 0 && (
          <div className="searchResult">
            <div className="searchData">
              {parseFloat(
                accOrTempData.temp[accOrTempData.temp.length - 1]
              ).toFixed(2)}
              &nbsp; ºC
            </div>
            <div className="searchChart">
              <TempChart data={accOrTempData}></TempChart>
            </div>
          </div>
        )}
    </div>
  );
}
