import React, { PureComponent } from 'react';
import HowToPopup from '../how-to-popup.jsx';
import AboutPopup from '../about-popup.jsx';
import UploadPopup from '../upload-popup.jsx';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { jsonOkRequired } from '../util';

export default class Topbar extends PureComponent {
  constructor(args) {
    super(args);

    this.state = {
      howToShow: false,
      aboutShow: false,
      uploadShow: false,
      showMenu: false,
    };
  }

  saveGraph() {
    fetch(`/graph/${this.props.graph}/save`, {
      method: 'POST',
      body: JSON.stringify(this.props.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(jsonOkRequired)
      .then(j => {
        console.log(j.message);
      })
      .catch(console.error);
  }

  render() {
    // attach the graph data to the Export button, see this for why
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    const exportData = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(this.props.data)
    )}`;
    return (
      <div>
        <Navbar
          className="main-navbar"
          expand="lg"
          bg="dark"
          variant="dark"
          fixed="top"
        >
          <Navbar.Brand>FAT Forensics</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown
                className="topbar-button"
                title="Graph Settings"
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item onClick={() => this.saveGraph()}>
                  Save
                </NavDropdown.Item>
                <NavDropdown.Item
                  as="a"
                  download={`${this.props.graph}.json`}
                  href={exportData}
                >
                  Export
                </NavDropdown.Item>
                <NavDropdown.Item>Rename</NavDropdown.Item>
                <NavDropdown.Item>Duplicate</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link
                className="topbar-button"
                onClick={() => this.setState({ uploadShow: true })}
              >
                New Dataset
              </Nav.Link>
              <Nav.Link
                className="topbar-button"
                onClick={() => this.setState({ howToShow: true })}
              >
                How To
              </Nav.Link>
              <Nav.Link
                className="topbar-button"
                onClick={() => this.setState({ aboutShow: true })}
              >
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <HowToPopup
          show={this.state.howToShow}
          onHide={() => this.setState({ howToShow: false })}
        />
        <AboutPopup
          show={this.state.aboutShow}
          onHide={() => this.setState({ aboutShow: false })}
        />
        <UploadPopup
          show={this.state.uploadShow}
          onHide={() => this.setState({ uploadShow: false })}
        />
      </div>
    );
  }
}
