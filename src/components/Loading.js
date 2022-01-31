import React from "react";
import ReactLoading from "react-loading";

export default function Loading({ height = 30, width = 30 }) {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <ReactLoading
        type={"bars"}
        color={"#8676ff"}
        width={width}
        height={height}
      ></ReactLoading>
    </div>
  );
}
