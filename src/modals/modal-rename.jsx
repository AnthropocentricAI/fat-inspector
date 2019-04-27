import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

export default class Rename extends React.Component {
  onSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    this.props.onSubmit(formData.get('new_name'));
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.onSubmit}>
          <Modal.Body>
            <Form.Group>
              <div className="form-label-wrapper">
                <Form.Label>New Name</Form.Label>
              </div>
              <Form.Control name="new_name" placeholder="New Name..." />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn btn-primary">
              Submit
            </Button>
            <Button className="btn btn-secondary">Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

Rename.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool,
};
