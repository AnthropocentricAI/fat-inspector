import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Tool from './graph/graph.jsx';
import InspBtn from './inspbtn/inspBtn.jsx';
// import InspBtnPop form './inspBtnPop.jsx';
 
const App = () => (
  <div>
    <p>Words</p>
    <Topbar />
    <Tool dataset='iris'/>
    <InspBtn />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
