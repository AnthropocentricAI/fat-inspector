import React, {PureComponent} from "react";
import SideBarButton from "./sidebarbutton.jsx";

const buttonnames = [
    {
      name: "Data"
    },
    {
      name: "Model"
    },
    {
      name: "Prediction"
    }
  ];
  
  class Sidebar extends PureComponent {
    render() {
      return (
        <div className="left">
          <div className="wrap">
            {buttonnames.map(button => (
              <SideBarButton name={button.name} />
            ))}
          </div>
        </div>
      );
    }
  }
  
  export default Sidebar;
  