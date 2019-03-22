import React, {PureComponent} from "react";
import TopSwitchButton from "./top-switch-button.jsx";

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

class TopSwitch extends PureComponent {
  render() {
    return (
      <div className="switch">
        <div className="wrap">
          {buttonnames.map(button => (
            <TopSwitchButton name={button.name}/>
          ))}
        </div>
      </div>
    );
  }
}

export default Sidebar;
