import AnimatedNumber from "animated-number-react";
import React from "react";

export default function App({ data, dig = 0 }) {
  const formatValue = (data) => data.toFixed(dig);
  return <AnimatedNumber value={data} formatValue={formatValue} />;
}
