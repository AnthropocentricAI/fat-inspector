import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Tool from './graph/graph.jsx'
 
const App = () => (
  <div>
    <p>Words</p>
    <Topbar />
    <Tool />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));