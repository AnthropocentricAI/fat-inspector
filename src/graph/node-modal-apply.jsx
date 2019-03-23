import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';

export default class NodeModalApply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validLabel: false,
      validFunc: false,
    };
  }

  validateLabel(e) {
    this.setState({
      validLabel: e.target.value !== ''
    });
  }

  validateFunc(e) {
    this.setState({
      validFunc: e.target.value !== -1
    })
  }

  createNode(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    this.props.onApply(this.props.node.id, formData.get('name'), formData.get('desc'), formData.get('func'));
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Apply Function To { this.props.node.label }</Modal.Title>
        </Modal.Header>
        <Form onSubmit={e => this.createNode(e)}>
          <Modal.Body>
            <Form.Group>
              <div className="form-label-wrapper">
                <Form.Label>Child Name</Form.Label>
              </div>
              <Form.Control placeholder='Name...'
                            name='name'
                            onChange={e => this.validateLabel(e)}/>
            </Form.Group>
            <Form.Group>
              <div className="form-label-wrapper">
                <Form.Label>Child Description</Form.Label>
              </div>
              <Form.Control placeholder='Description... (Optional)'
                            name='desc'
                            as='textarea'/>
            </Form.Group>
            <Form.Group>
              <div className="form-label-wrapper">
                <Form.Label>Function</Form.Label>
              </div>
              <Form.Control as='select'
                            defaultValue={-1}
                            name='func'
                            onChange={e => this.validateFunc(e)}>
                <option disabled hidden value={-1}>Select a function...</option>
                {
                  this.props.functions.map(f => <option key={f} value={f}>{f}</option>)
                }
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.props.onHide}>
              Close
            </Button>
            <Button variant='primary'
                    type='submit'
                    disabled={!(this.state.validFunc && this.state.validLabel)}>
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

NodeModalApply.propTypes = {
  functions: PropTypes.arrayOf(PropTypes.string).isRequired,
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  show: PropTypes.bool.isRequired,
};