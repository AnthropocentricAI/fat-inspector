import React, { PureComponent } from "react";
import Topswitchbutton from "./topswitchbutton.jsx";

const buttonnames = [
  {
    name: "Fairness"
  },
  {
    name: "Accountability"
  },
  {
    name: "Transparency"
  }
];

class Topswitch extends PureComponent {
  render() {
    return (
      <div className="switch">
        <div className="wrap">
          {buttonnames.map(button => (
            <Topswitchbutton name={button.name} />
          ))}
        </div>
      </div>
    );
  }
}

export default Sidebar;
