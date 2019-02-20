import React, { PureComponent } from "react";

export default class SideBarButton extends PureComponent {
  render() {
    return <button className="sidebarbutton">{this.props.name}</button>;
  }
}
