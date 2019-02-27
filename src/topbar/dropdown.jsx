import React, { PureComponent } from "react";
import TopbarButton from "./topbarbutton.jsx";

class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      ishovering: false
    };
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      ishovering: !state.ishovering
    };
  }

  render() {
    return (
      <div className="dropdown">
        <TopbarButton
          name={this.props.name}
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}
        />
        {this.state.ishovering && (
          <div>
            {this.props.dropdowns.map(button => (
              <TopbarButton
                key={button.name}
                name={button.name}
                className="dropbutton"
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Topbar;
