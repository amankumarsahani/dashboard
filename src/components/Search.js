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
import ReactSelect from "./ReactSelect.js";

// const S_KEY = "time_stamp";
const S_KEY = "logTime";

export default function Search({
  apiUrl,apiUrl2,
  url,
  refresh,
  theme,
  vw,
  forwardedRef,
  setSearchId,
  dropdownOptions,
}) {
  const [searchField, setSearchField] = useState("");
  const [id, setId] = useState("C6:2B:45:5F:71:FD");
  const [searchLim, setSearchLim] = useState(10);
  const [lim, setLim] = useState(10);
  const [cal,setCal] =useState("");
  const [accOrTempData, setAccOrTempData] = useState("");
  const [sensor, setSensor] = useState("acc");
  const [responded, setResponded] = useState(true);

  const handleSearchChange = (e) => {
    setCal(e.color);
    setSearchField(e.value);
    setId(e.value);
  };
  const handleLimChange = (e) => {
    setSearchLim(e.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchField.length === 17) setId(searchField);
    setLim(searchLim);
  };

  const handleNewResponse = (responseOne,responseTwo) => {
    if (sensor === "acc" && cal==='red') {
      if (responseOne.data) {
        let atd = makeAccDataFromQuery(responseOne.data, S_KEY);
        if (
          !arrayEquals(atd.dataLabels, accOrTempData.dataLabels) ||
          !arrayEquals(atd.abs, accOrTempData.abs) ||
          !arrayEquals(atd.dataY, accOrTempData.dataY) ||
          !arrayEquals(atd.dataZ, accOrTempData.dataZ)
        ) {
          setAccOrTempData(atd);
        }
      } else {
        let atd = makeTempDataFromQuery(responseOne.data, S_KEY);
        setSensor("temp");
        setAccOrTempData(atd);
      }
    } else {
      (cal==='green'?setSensor('temp'):setSensor("acc"));

      if (responseTwo.data) {
        let atd = makeTempDataFromQuery(responseTwo.data, S_KEY);
        if (
          !arrayEquals(atd.dataLabels, accOrTempData.dataLabels) ||
          !arrayEquals(atd.temp, accOrTempData.temp)
        ) {
          setAccOrTempData(atd);
        }
      } else {
        let atd = makeAccDataFromQuery(responseTwo.data, S_KEY);
        setSensor("acc");
        setAccOrTempData(atd);
      }
    }
  };
  const [prev, setPrev] = useState("C6:2B:45:5F:71:FD");

  useEffect(()=>{
    const reqOne = axios.get(apiUrl + "&sensorId=" + id + "&lim=" + searchLim);
    const reqTwo = axios.get(apiUrl2 + "&sensorId=" + id + "&lim=" + searchLim);
    setResponded(false);

    axios.all([reqOne, reqTwo]).then(axios.spread((...responses) => {
      const responseOne = responses[0]
      const responseTwo = responses[1]

      if (responseOne.data!==0 || responseTwo.data!==0) {
        if (!accOrTempData) {
          if (responseOne) {
            setSensor("acc");
            setAccOrTempData(
              makeAccDataFromQuery(responseOne.data, S_KEY)
            );
          } else if (responseTwo) {
            setSensor("temp");
            setAccOrTempData(
              makeTempDataFromQuery(responseTwo.data, S_KEY)
            );
          }
        }
        else {
          handleNewResponse(responseOne,responseTwo);
          setPrev(id);
          setSearchId(id);
        }
        
    }
    else {console.log(`No Historic Data for Device ID: ${id}`);
        setResponded(true);}
  }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
  },[refresh, apiUrl,apiUrl2])

  /////////////
  // useEffect(() => {
  //   setResponded(false);
  //   axios.get(url + "?sensorId=" + id + "&lim=" + lim).then((response) => {
  //     // console.log(url + "?sensorId=" + id + "&lim=" + lim);
  //     console.log(response);
  //     if (response.data!== 0) {
  //       console.log(!accOrTempData);
  //       console.log(response.data.accOrTemp[0].Sensor);
  //       if (!accOrTempData) {
  //         if (response.data.accOrTemp[0].Sensor === "Accelerometer") {
  //           setSensor("acc");
  //           setAccOrTempData(
  //             makeAccDataFromQuery(response.data.accOrTemp, S_KEY)
  //           );
  //         } else if (response.data.accOrTemp[0].Sensor === "Temperature") {
  //           setSensor("temp");
  //           setAccOrTempData(
  //             makeTempDataFromQuery(response.data.accOrTemp, S_KEY)
  //           );
  //         }
  //       } else handleNewResponse(response);
  //       setPrev(id);
  //       setSearchId(id);
  //     } else console.log(`No Historic Data for Device ID: ${id}`);
  //     setResponded(true);
  //   });
  // }, [id, url, refresh, lim]);

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
                legendColor={theme ? "#00c3ff" : "#6753ff"}
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
                legendColor={theme ? "#00c3ff" : "#6753ff"}
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
            <span id="limCounter">{searchLim}</span>
          </div>
          {/* <input
            id="searchFormInput"
            type="text"
            value={searchField}
            placeholder={prev}
            onChange={handleSearchChange}
          /> */}
          {/* <select
            id="searchFormInput"
            value={searchField}
            onChange={handleSearchChange}
          >
            {dropdownOptions[0] &&
              dropdownOptions[1] &&
              dropdownOptions.map((type, i) =>
                type.map((opt) => (
                  <option
                    key={`${opt}${i}`}
                    label={`${opt}  ${i ? "Temp" : "Acc"}`}
                    value={opt}
                  >
                    {opt}
                  </option>
                ))
              )}
          </select> */}
          {dropdownOptions[0] && dropdownOptions[1] && (
            <ReactSelect
              id="searchFormInput"
              accOpts={dropdownOptions[0]}
              tempOpts={dropdownOptions[1]}
              handleChange={handleSearchChange}
              them={theme}
              vw={vw}
            />
          )}
          
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
