import React from "react";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types';


export default class NodeModalEdit extends React.Component {
  submitSave(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    this.props.onEdit(this.props.node.id, data.get('label'), data.get('desc'));
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edit { this.props.node.label }</Modal.Title>
        </Modal.Header>
        {/* TODO: include validation */}
        <Form onSubmit={e => this.submitSave(e)}>
          <Modal.Body>
            <Form.Group controlId="">
              <div className="form-label-wrapper">
                <Form.Label>Label</Form.Label>
              </div>
              {/* TODO: make get label/name work better */}
              <Form.Control name="label"
                            placeholder={this.props.node.label}/>
              <div className="form-label-wrapper">
                <Form.Label>Description</Form.Label>
              </div>
              <Form.Control as="textarea"
                            name="desc"
                            placeholder={this.props.node.desc}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
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
  node: PropTypes.shape({
    desc: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onHide: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};