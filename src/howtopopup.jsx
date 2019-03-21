import React, { PureComponent } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class HowToPopUp extends React.Component {
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
            HOW TO USE FAT FORENSICS DATA TOOL
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Manipulating Datasets</h4>
          <p>
            To apply a function provided by FAT Forensics to your dataset, click
            on the node representing the chosen dataset, and in the pop-up click
            "apply function". Once a function is chosen, a new child node of
            given dataset will appear representing altered data.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default HowToPopUp;
