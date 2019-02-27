import React, { PureComponent } from "react";
import TopbarButton from "./topbarbutton.jsx";

const buttonnames = [
  {
    name: "EDIT DATASET"
  },
  {
    name: "NEW DATASET"
  },
  {
    name: "HOW TO USE"
  },
  {
    name: "ABOUT"
  }
];

class Topbar extends PureComponent {
  render() {
    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          {buttonnames.map(button => (
            <TopbarButton name={button.name} />
          ))}
        </div>
      </div>
    );
  }
}

export default Topbar;
