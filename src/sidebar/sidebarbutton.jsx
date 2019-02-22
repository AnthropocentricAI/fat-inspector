import React, { PureComponent } from "react";

export default class Topswitchbutton extends PureComponent {
  render() {
    return <button className="Topswitchbutton">{this.props.name}</button>;
  }
}
