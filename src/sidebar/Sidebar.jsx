import React, { PureComponent } from "react";
import SideBarButton from "./sidebarbutton.jsx";

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
            <TopswitchButton name={button.name} />
          ))}
        </div>
      </div>
    );
  }
}

export default Sidebar;
