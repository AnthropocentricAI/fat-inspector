import React, { PureComponent } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class AboutPopUp extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            ABOUT FAT FORENSICS
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>What We Do</h4>
          <p>
            FAT Forensics is an organisation to help test the Fairness,
            Accountability and Transparency of AI systems by analysing users'
            datasets and models derrived from them.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AboutPopUp;
