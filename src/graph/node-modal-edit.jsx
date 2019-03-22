import React from "react";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class NodeModalEdit extends React.Component {
  submitSave(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    this.props.edit(this.props.node.id, data.get('name'), data.get('desc'));
    this.props.onClose();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header>
          <Modal.Title>Edit { this.props.node.label }</Modal.Title>
        </Modal.Header>
        {/* TODO: include validation */}
        <Form onSubmit={(e) => this.submitSave(e)}>
          <Modal.Body>
            <Form.Group controlId="">
              <div className="form-label-wrapper">
                <Form.Label>Name:</Form.Label>
              </div>
              {/* TODO: make get label/name work better */}
              <Form.Control name="name"
                            placeholder={this.props.node.label}/>
              <div className="form-label-wrapper">
                <Form.Label>Description:</Form.Label>
              </div>
              <Form.Control name="desc" placeholder={this.props.node.desc}/>
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