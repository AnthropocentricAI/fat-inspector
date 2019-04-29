import React, { PureComponent } from 'react';
import HowToPopup from '../how-to-popup.jsx';
import AboutPopup from '../about-popup.jsx';
import UploadPopup from '../upload-popup.jsx';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { jsonOkRequired } from '../util';
import PropTypes from 'prop-types';

export default class Topbar extends PureComponent {
  constructor(args) {
    super(args);

    this.state = {
      howToShow: false,
      aboutShow: false,
      uploadShow: false,
      showMenu: false,
    };

    this.chooseColourObject = this.chooseColourObject.bind(this);
  }

  chooseColourObject() {
    if (this.props.mode === 'data') {
      return { boxShadow: '0 0 70px 0 #DD6E42' };
    } else if (this.props.mode === 'model') {
      return { boxShadow: '0 0 70px 0 #3CB371' };
    } else if (this.props.mode === 'prediction') {
      return { boxShadow: '0 0 70px 0 #C71585' };
    }
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
          style={this.chooseColourObject()}
        >
          <Navbar.Brand>
            {this.props.dataset}: {this.props.graph}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown
                className="topbar-button"
                title="Graph Settings"
                id="collasible-nav-dropdown"
              >
                {this.props.items.map(({ text, ...data }) => (
                  <NavDropdown.Item
                    key={`topbar-dropdown-item-${text}`}
                    {...data}
                  >
                    {text}
                  </NavDropdown.Item>
                ))}
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
              <Navbar.Brand className="brand">FAT Forensics</Navbar.Brand>
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

Topbar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
};
