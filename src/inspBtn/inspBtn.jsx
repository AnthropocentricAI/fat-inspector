import React, { PureComponent } from "react";
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';

class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
        <div className="popup_title">
        {/* <Tab className="popup_title"> {key=>this.props.key}</Tab> */}


        {/* <Tabs id="controlled-tab-example" activeKey={this.state.key} onSelect={key => this.setState({ key })}>
        <Tab eventKey="home" title="Home">
          <Sonnet />
        </Tab>
      </Tabs> */}

        {/* <button class="popup_title" onClick={this.props.key}>Fairness</button> */}
        <button className="popup_tab">{this.props.text1}</button>
        <button className="popup_tab">{this.props.text2}</button>
        <button className="popup_tab">{this.props.text3}</button>
        <button class="popup_close" onClick={this.props.closePopup}>X</button>
        </div>
        </div>
      </div>
    );
  }
}


class InspBtn extends React.Component {
  constructor() {
        super();
        // this.toggle = this.toggle.bind(this);
        this.state = {
          // key: 'home',
          popoverOpen: false
        };
      }

    toggle() {
      this.setState({
        popoverOpen: !this.state.popoverOpen
      });
    }

    render() {
      // let popover =(
      //   <popover className="popover" id = "" title="over1">
      //   <p>fairness</p>
      //   <p>transparency</p>
      //   <p>acc</p>
      //   </popover>
      // )
        return(
        <div className="inspBtn_wrap">
        <button onClick={this.toggle.bind(this)}>Inspect</button>
        {this.state.popoverOpen ?
        <Popup
          text1="fairness"
          text2="accountability"
          text3="transparency"
          // key={this.toggle.bind(this)}
          closePopup={this.toggle.bind(this)}
        />
        :null
        }
        {/* <button className="inspBtn">inspector</button> */}
        {/* <OverlayTrigger trigger="click" placement="top" overlay={popover}>
        <Button  className="inspBtn" id="Popover1" type="button">
        Inspect
        </Button>
        </OverlayTrigger> */}
        </div>        
        );
    }
};

export default InspBtn;