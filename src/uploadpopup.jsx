import React, { PureComponent } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class UploadPopUp extends React.Component {
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
            UPLOAD YOUR DATASET
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>LIAMS ENDS</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UploadPopUp;
