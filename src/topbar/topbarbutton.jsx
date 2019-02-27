import React, { PureComponent } from "react";

export default class TopbarButton extends PureComponent {
  render() {
    return <button className="topbarbutton">{this.props.name}</button>;
  }
}
