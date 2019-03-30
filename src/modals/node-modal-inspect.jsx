import React from "react";

import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";

export default class NodeModalInspect extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Inspect {this.props.node.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Fairness">
              hello there:) this is tab1
            </Tab>
            <Tab eventKey="profile" title="Accountability">
              tab2
            </Tab>
            <Tab eventKey="contact" title="Transparency">
              tab3
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NodeModalInspect.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
