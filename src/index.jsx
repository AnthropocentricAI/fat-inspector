import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";

const App = () => (
  <div>
    <Topbar />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
