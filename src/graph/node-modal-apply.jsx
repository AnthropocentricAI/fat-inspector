import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";

export default class NodeModalApply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validName: false,
            validFunc: false,
        }
    }

    validateName(e) {
        this.setState({
            validName: e.target.value !== ''
        });
    }

    validateFunc(e) {
        this.setState({
            validFunc: e.target.value !== -1
        })
    }

    createNode(e) {
        e.preventDefault();
        e.stopPropagation();

        // todo: validation

        let formData = new FormData(e.target);
        let name = formData.get('name');
        let desc = formData.get('desc');
        let func = formData.get('func');
        this.props.onApply(this.props.parent, name, desc, func);
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Apply Function</Modal.Title>
                </Modal.Header>
                <Form onSubmit={this.createNode.bind(this)}>
                    <Modal.Body>
                        <Form.Group>
                            <div className="form-label-wrapper">
                                <Form.Label>Child Name</Form.Label>
                            </div>
                            <Form.Control placeholder='Name...'
                                          name='name'
                                          onChange={this.validateName.bind(this)}/>
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
                                          onChange={this.validateFunc.bind(this)}>
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
                                disabled={!(this.state.validFunc && this.state.validName)}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}