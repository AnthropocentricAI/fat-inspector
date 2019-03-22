import * as React from 'react';
import {timingSafeEqual} from 'crypto';

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.toggleClosed = this.toggleClosed.bind(this);
    this.state = {closed: false}
  }

  toggleClosed() {
    this.setState(prevState => ({
      closed: !prevState.closed
    }));
  }

  render() {
    const closed = this.state.closed;
    return (
      <div>
        {!closed &&
        <div className="popup_cont">
          <div>
            <img className="popup_close" src="assets/gear.svg" onClick={this.toggleClosed}></img>
            <h2 className="popup_title">{this.props.title}</h2>
          </div>
          <p className="popup_desc">{this.props.desc}</p>
          <div className="popup_form">
            {this.props.children}
          </div>
        </div>
        }
      </div>
    );
  }
};