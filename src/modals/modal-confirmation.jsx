import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

export default class ModalConfirmation extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} centered>
        <Modal.Header className="confirmation-title" closeButton>
          <Modal.Title>Are You Sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="confirmation-message">{this.props.message}</p>
        </Modal.Body>
        <Modal.Footer className="centred-flex footer-no-border">
          <Button
            variant="primary"
            onClick={() => {
              this.props.onConfirm();
              this.props.onHide();
            }}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={this.props.onHide}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ModalConfirmation.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
