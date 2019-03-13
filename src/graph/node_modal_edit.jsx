import React from "react";

import Modal from 'react-bootstrap/Modal'

export default class NodeModalEdit extends React.Component {
    render() {
        return (
            <Modal show={ this.props.show } onHide={ this.props.onClose }>
                <Modal.Header>
                    <Modal.Title>Edit </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    body
                </Modal.Body>
                <Modal.Footer>
                    footer
                </Modal.Footer>
            </Modal>
        );
    }
}