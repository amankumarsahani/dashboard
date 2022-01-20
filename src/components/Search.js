import axios from "axios";
import React, { useState, useEffect } from "react";
import AccChart from "./charts/AccChart";
import TempChart from "./charts/TempChart";
import "./Search.css";
import { makeAccData, makeTempData } from "../utils.js";

export default function Search({ url, refresh }) {
  const [searchField, setSearchField] = useState("");
  const [id, setId] = useState("1:2:3");
  const [tempData, setTempata] = useState("");
  const [accData, setAccdata] = useState("");

  const type = {
    dataX: "bar",
    dataY: "bar",
    dataZ: "bar",
    abs: "bar",
  };

  const handleChange = (e) => {
    setSearchField(e.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchField.length === 5) setId(searchField);
  };

  useEffect(() => {
    axios
      .get(url + "?id=" + id)
      .then((response) => {
        if (response !== []) {
          setTempata(makeTempData(response.data.temp, "time_stmp"));
          setAccdata(makeAccData(response.data.acc, "time_stmp"));
        }
      })
      .catch((err) => console.error(err));
  }, [id, url, refresh]);

  return (
    <div id="SearchContainer">
      <div id="searchTitle">Search Device</div>
      <form id="searchForm" onSubmit={handleSubmit}>
        <span>Device ID :</span>
        <input
          id="searchFormInput"
          type="text"
          value={searchField}
          placeholder={id}
          onChange={handleChange}
        />
        <input id="searchFormSubmit" type="submit" value="Submit" />
      </form>
      {tempData && tempData.temp.length !== 0 && (
        <div className="searchResult">
          <div className="searchData">{tempData.temp[0]}</div>
          <div className="searchChart">
            <TempChart data={tempData}></TempChart>
          </div>
        </div>
      )}
      {accData && accData.abs.length !== 0 && (
        <div className="searchResult">
          <div className="searchData">
            {parseFloat(accData.abs[0]).toFixed(2)}
          </div>
          <div className="searchChart">
            <AccChart data={accData} type={type}></AccChart>
          </div>
        </div>
      )}
    </div>
  );
}
