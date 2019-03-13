import React, { PureComponent } from "react";

export default class DisplayName extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="showname">
        <h1>Dataset: {this.props.text},</h1>
      </div>
    );
  }
}
