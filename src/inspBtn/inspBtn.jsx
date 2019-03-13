import React, { PureComponent } from "react";
// import PropTypes from 'prop-types';
// import InspBtnPop from "./inspBtnPop.jsx";
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
// import PopoverHeader from 'react-bootstrap/PopoverHeader';



// class MouseOverPopover extends React.Component {
//   state = {
//     anchorEl: null,
//   };

//   handlePopoverOpen = event => {
//     this.setState({ anchorEl: event.currentTarget });
//   };

//   handlePopoverClose = () => {
//     this.setState({ anchorEl: null });
// };

// class MouseOverPopover extends React.Component {
class InspBtn extends PureComponent {


  // state = {
  //   anchorEl: null,
  // };

  // handlePopoverOpen = event => {
  //   this.setState({ anchorEl: event.currentTarget });
  // };

  // handlePopoverClose = () => {
  //   this.setState({ anchorEl: null });



  constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          popoverOpen: false
        };
    }

    toggle() {
      this.setState({
        popoverOpen: !this.state.popoverOpen
      });
    }


    render() {
      const { classes } = this.props;
      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);


      let popover =(
        <popover className="popover" id = "" title="over1">
        <p>fairness</p>
        <p>df</p>
        <p>dfgggggggggg</p>
        {/* Fairness */}
        </popover>
        // <popover id = "" title="over2">
        // Accountability
        // </popover>
        // <popover id = "" title="over3">
        // Transparency 
        // </popover>
      )
        // const popup = (<Popover placement="top" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
        // {/* <PopoverHeader>Popover Title</PopoverHeader>
        // <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare scem lacinia quam venenatis vestibulum.</PopoverBody> */}
        // </Popover>)
        return(
        <div className="inspBtn_wrap">
        {/* <button className="inspBtn">inspector</button> */}
        <OverlayTrigger trigger="click" placement="top" overlay={popover}>

        <Button  className="inspBtn" id="Popover1" type="button">
        Inspect
        </Button>
        </OverlayTrigger>
        </div>        
        )
    }
}

export default InspBtn;