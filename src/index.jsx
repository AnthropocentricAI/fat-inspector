import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";

//import '/scss/app.scss';

const App = () => (
  <div className="mainwrapper">
    <Topbar />
    {/* <Inspectbutton /> */}
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
