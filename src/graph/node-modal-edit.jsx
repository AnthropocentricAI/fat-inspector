import React from "react";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types';


export default class NodeModalEdit extends React.Component {
  submitSave(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    this.props.onEdit(this.props.nodeId, data.get('label'), data.get('desc'));
    this.props.onClose();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header>
          <Modal.Title>Edit { this.props.nodeLabel }</Modal.Title>
        </Modal.Header>
        {/* TODO: include validation */}
        <Form onSubmit={(e) => this.submitSave(e)}>
          <Modal.Body>
            <Form.Group controlId="">
              <div className="form-label-wrapper">
                <Form.Label>Label</Form.Label>
              </div>
              {/* TODO: make get label/name work better */}
              <Form.Control name="label"
                            placeholder={this.props.nodeLabel}/>
              <div className="form-label-wrapper">
                <Form.Label>Description</Form.Label>
              </div>
              <Form.Control as="textarea"
                            name="desc"
                            placeholder={this.props.nodeDesc}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

NodeModalEdit.propTypes = {
  nodeDesc: PropTypes.string,
  nodeId: PropTypes.string.isRequired,
  nodeLabel: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};