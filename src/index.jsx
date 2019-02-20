import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";

const App = () => (
  <div>
    <Topbar />
    <Sidebar />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
