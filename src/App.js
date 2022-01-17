import "./App.css";
import Chart1 from "./components/charts/Chart1.js";
import Chart2 from "./components/charts/Chart2.js";
import Chart3 from "./components/charts/Chart3.js";
import Chart4 from "./components/charts/Chart4.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Data Analysis</div>
        <div>About</div>
      </header>
      <div className="graphHolder">
        <div className="graph">
          <Chart1></Chart1>
        </div>
        <div className="graph">
          <Chart2></Chart2>
        </div>
        <div className="graph">
          <Chart3></Chart3>
        </div>
        <div className="graph">
          <Chart4></Chart4>
        </div>
      </div>
    </div>
  );
}

export default App;
