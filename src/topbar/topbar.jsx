import React, { PureComponent } from 'react';
import HowToPopup from '../how-to-popup.jsx';
import AboutPopup from '../about-popup.jsx';
import UploadPopup from '../upload-popup.jsx';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const buttonnames = [
  {
    name: 'EDIT DATASET',
    dropdowns: [
      {
        name: 'Save',
      },
      {
        name: 'Export',
      },
      {
        name: 'Rename',
      },
      {
        name: 'Duplicate',
      },
      {
        name: 'Import',
      },
    ],
  },
  {
    name: 'NEW DATASET',
  },
  {
    name: 'HOW TO USE',
  },
  {
    name: 'ABOUT',
  },
];

class Topbar extends PureComponent {
  constructor(args) {
    super(args);

    this.state = {
      howToShow: false,
      aboutShow: false,
      uploadShow: false,
      showMenu: false,
    };
    this.modalClose = this.modalClose.bind(this);
    this.uploadOpen = this.uploadOpen.bind(this);
    this.howToOpen = this.howToOpen.bind(this);
    this.aboutOpen = this.aboutOpen.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu(event) {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  }

  modalClose() {
    this.setState({
      howToShow: false,
      aboutShow: false,
      uploadShow: false,
    });
  }

  uploadOpen() {
    this.setState({
      howToShow: false,
      aboutShow: false,
      uploadShow: true,
    });
  }

  howToOpen() {
    this.setState({
      howToShow: true,
      aboutShow: false,
      uploadShow: false,
    });
  }

  aboutOpen() {
    this.setState({
      howToShow: false,
      aboutShow: true,
      uploadShow: false,
    });
  }

  render() {
    return (
      <div>
        <Navbar
          className="main-navbar"
          expand="lg"
          bg="dark"
          variant="dark"
          fixed="top"
        >
          <Navbar.Brand href="#home">FAT Forensics</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown
                className="topbar-button"
                title="Dataset Settings"
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item>Save</NavDropdown.Item>
                <NavDropdown.Item>Export</NavDropdown.Item>
                <NavDropdown.Item>Rename</NavDropdown.Item>
                <NavDropdown.Item>Duplicate</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className="topbar-button" onClick={this.uploadOpen}>
                New Dataset
              </Nav.Link>
              <Nav.Link className="topbar-button" onClick={this.howToOpen}>
                How To
              </Nav.Link>
              <Nav.Link className="topbar-button" onClick={this.aboutOpen}>
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <HowToPopup show={this.state.howToShow} onHide={this.modalClose} />
        <AboutPopup show={this.state.aboutShow} onHide={this.modalClose} />
        <UploadPopup show={this.state.uploadShow} onHide={this.modalClose} />
      </div>
    );
  }
}

export default Topbar;
