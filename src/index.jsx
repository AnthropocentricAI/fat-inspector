import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";

import './scss/app.scss';

const App = () => (
  <div>
    <Topbar />
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
