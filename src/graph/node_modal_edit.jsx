import React from "react";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class NodeModalEdit extends React.Component {    
    submitSave(e) {
        e.preventDefault();
        let data = new FormData(e.target);
        this.props.rename(this.props.node.id, data.get('name'));
        this.props.onClose();
    }

    render() {
        return (
            <Modal show={ this.props.show } onHide={ this.props.onClose }>
                <Modal.Header>
                    <Modal.Title>Edit { 'label' in this.props.node ? this.props.node.label : this.props.node.id }</Modal.Title>
                </Modal.Header>
                {/* TODO: include validation */}
                <Form onSubmit={ (e) => this.submitSave(e) }>
                    <Modal.Body>
                        <Form.Group controlId="">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control name="name" placeholder={ this.props.node.id }></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="">

                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={ this.props.onClose }>
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