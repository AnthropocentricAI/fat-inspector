import React, {PureComponent} from "react";
import HowToPopup from "../how-to-popup.jsx";
import AboutPopup from "../about-popup.jsx";
import UploadPopup from "../upload-popup.jsx";
import Dropdown from "react-bootstrap/Dropdown";

const buttonnames = [
  {
    name: "EDIT DATASET",
    dropdowns: [
      {
        name: "Save"
      },
      {
        name: "Export"
      },
      {
        name: "Rename"
      },
      {
        name: "Duplicate"
      },
      {
        name: "Import"
      }
    ]
  },
  {
    name: "NEW DATASET"
  },
  {
    name: "HOW TO USE"
  },
  {
    name: "ABOUT"
  }
];

class Topbar extends PureComponent {
  constructor(args) {
    super(args);

    this.state = {howToShow: false, aboutShow: false, uploadShow: false};
    this.modalClose = this.modalClose.bind(this);
    this.uploadOpen = this.uploadOpen.bind(this);
    this.howToOpen = this.howToOpen.bind(this);
    this.aboutOpen = this.aboutOpen.bind(this);
  }

  modalClose() {
    this.setState({
      howToShow: false,
      aboutShow: false,
      uploadShow: false
    });
  }

  uploadOpen() {
    this.setState({
      howToShow: false,
      aboutShow: false,
      uploadShow: true
    });
  }


  render() {
    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <Dropdown bsPrefix="super-button" className="topbarbutton">
            <Dropdown.Toggle>Dataset Options</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Save Dataset</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Export Dataset</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Settings</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <button className="topbarbutton" onClick={this.uploadOpen}>
            New Dataset
          </button>
          <button className="topbarbutton" onClick={this.howToOpen}>
            How To
          </button>
          <button className="topbarbutton" onClick={this.aboutOpen}>
            About
          </button>
        </div>

        <HowToPopup show={this.state.howToShow} onHide={this.modalClose}/>
        <AboutPopup show={this.state.aboutShow} onHide={this.modalClose}/>
        <UploadPopup show={this.state.uploadShow} onHide={this.modalClose}/>
      </div>
    );
  }
}

export default Topbar;
