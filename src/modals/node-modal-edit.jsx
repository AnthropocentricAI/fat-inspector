import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Collapse from 'react-bootstrap/Collapse';

export default class NodeModalEdit extends React.Component {
  constructor(props) {
    super(props);
    const functionSelected = !this.props.add && !!this.props.node.function;
    this.state = {
      validIndices: functionSelected,
      validAxis: true,
      validLabel: !this.props.add,
      validFunc: functionSelected,
      functionSelected: functionSelected,
    };
    this.baseState = this.state;
  }

  onHide = () => {
    this.setState(this.baseState, () => this.props.onHide());
  };

  validateIndices(e) {
    try {
      const indices = JSON.parse(e.target.value);
      const isValid =
        indices instanceof Array &&
        indices.reduce((valid, item) => valid && Number.isInteger(item), true);
      this.setState({
        validIndices: isValid,
      });
    } catch {
      this.setState({
        validIndices: false,
      });
    }
  }

  createNode(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const func = this.state.functionSelected
      ? {
          name: formData.get('func'),
          indices: JSON.parse(formData.get('indices')),
          axis: Number(formData.get('axis')),
        }
      : undefined;
    const node = {
      label: formData.get('name'),
      desc: formData.get('desc'),
      function: func,
    };
    this.props.onSubmit(this.props.node.id, node);
  }

  // TODO: refactor this horrible validation
  render() {
    return (
      <Modal show={this.props.show} onHide={this.onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.add ? 'Add Child To' : 'Edit'} '{this.props.node.label}'
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={e => this.createNode(e)}>
          <Modal.Body>
            <Form.Group>
              <div className="form-label-wrapper">
                <Form.Label>Name</Form.Label>
              </div>
              <Form.Control
                placeholder="Name..."
                name="name"
                onChange={e =>
                  this.setState({ validLabel: e.target.value !== '' })
                }
                defaultValue={this.props.add ? '' : this.props.node.label}
              />
            </Form.Group>
            <Form.Group>
              <div className="form-label-wrapper">
                <Form.Label>Description</Form.Label>
              </div>
              <Form.Control
                placeholder="Description... (Optional)"
                name="desc"
                as="textarea"
                defaultValue={this.props.add ? '' : this.props.node.desc}
              />
            </Form.Group>
            <Form.Group>
              <div className="form-label-wrapper">
                <Form.Label>Function</Form.Label>
              </div>
              <Form.Control
                as="select"
                defaultValue={
                  this.props.add || !this.props.node.function
                    ? -1
                    : this.props.node.function.name
                }
                name="func"
                onChange={e =>
                  this.setState({
                    functionSelected:
                      e.target.value !== '' && Number(e.target.value) !== -1,
                  })
                }
              >
                <option value={-1}>None</option>
                {this.props.functions.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Collapse in={this.state.functionSelected}>
              <div>
                <Form.Group>
                  <div className="form-label-wrapper">
                    <Form.Label>Indices</Form.Label>
                  </div>
                  <Form.Control
                    name="indices"
                    onChange={e => this.validateIndices(e)}
                    placeholder="Indices as a list... [0, 2, 3]"
                    defaultValue={
                      this.props.add || !this.props.node.function
                        ? ''
                        : `[${this.props.node.function.indices}]`
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <div className="form-label-wrapper">
                    <Form.Label>Axis</Form.Label>
                  </div>
                  <Form.Control
                    type="number"
                    name="axis"
                    onChange={e =>
                      this.setState({ validAxis: e.target.value >= 0 })
                    }
                    defaultValue={
                      this.props.add || !this.props.node.function
                        ? 0
                        : this.props.node.function.axis
                    }
                  />
                </Form.Group>
              </div>
            </Collapse>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              type="submit"
              disabled={
                !(
                  this.state.validLabel &&
                  (!this.state.functionSelected ||
                    (this.state.functionSelected &&
                      this.state.validIndices &&
                      this.state.validAxis))
                )
              }
            >
              Save
            </Button>
            <Button variant="secondary" onClick={this.onHide}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

NodeModalEdit.propTypes = {
  functions: PropTypes.arrayOf(PropTypes.string).isRequired,
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    function: PropTypes.shape({
      name: PropTypes.string.isRequired,
      indices: PropTypes.array.isRequired,
      axis: PropTypes.number.isRequired,
    }),
  }).isRequired,
  show: PropTypes.bool.isRequired,
};
