import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <ReactLoading type={"bars"} color={"#2980b9"}></ReactLoading>;
    </div>
  );
}
