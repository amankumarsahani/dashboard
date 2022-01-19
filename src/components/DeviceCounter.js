import AnimatedNumber from "animated-number-react";
import React from "react";

export default function App({ data }) {
  const formatValue = (data) => data.toFixed(0);
  return <AnimatedNumber value={data} formatValue={formatValue} />;
}
