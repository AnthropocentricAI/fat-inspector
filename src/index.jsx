import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Tool from './graph/graph.jsx';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FileFacade from './fileFacade.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// const App = () => (
//     <div>
//         <p>Words</p>
//         <Topbar />
//         <Tool dataset='iris'/>
//     </div>
// );

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { datasets: [], uploadModal: false }
    }

    openUploadModal() {
        this.setState({
            ...this.state,
            uploadModal: true
        })
    }

    closeUploadModal() {
        this.setState({
            ...this.state,
            uploadModal: false
        })
    }

    openGraph() {
        alert('TODO');
    }

    componentWillMount() {
        // on load, ask the server for a list of datasets
        fetch('/dataset/view')
            .then(
                function success(response) {
                    if (response.status !== 200) {
                        console.error('Failed to get a list of datasets from the server!\n');
                        return;
                    }

                    response.json().then(function (data) {
                        this.setState({
                            ...this.state,
                            datasets: data,
                        });
                        console.log(this.state);
                    }.bind(this))
                }.bind(this),

                function failure(err) {
                    console.error(err);
                }.bind(this)
            )
    }

    render() {
        return (
            <div>
                <div className='form-main'>
                <Form>
                    <div className="form-label-wrapper">
                        <Form.Label>Dataset</Form.Label>
                    </div>
                    <Row>
                        <Form.Control as='select' placeholder='Dataset Name...'>
                            <option disabled selected hidden>Select a dataset...</option>
                            {
                                this.state.datasets.map(d => (
                                    <option key={d}>{d}</option>
                                ))
                            }
                        </Form.Control>
                    </Row>
                    <div className="form-label-wrapper">
                        <Form.Label>Graph</Form.Label>
                    </div>
                    <Row>
                        <Form.Control as='select' placeholder='Dataset Name...'>
                            <option disabled selected hidden>Select a graph...</option>
                            {
                                this.state.datasets.map(d => (
                                    <option key={d}>{d}</option>
                                ))
                            }
                        </Form.Control>
                    </Row>
                    <Row>
                        <div className="form-wrapper-centre">
                            <Button onClick={this.openGraph.bind(this)} variant='primary'>
                                Open Graph
                            </Button>
                            <Button onClick={this.openUploadModal.bind(this)} variant='link'>
                                Upload Custom
                            </Button>
                        </div>
                    </Row>
                </Form>
            </div>
                <Modal show={this.state.uploadModal}
                       onHide={this.closeUploadModal.bind(this)}
                       centered
                       size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Dataset/Graph</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <div className='form-label-wrapper'>
                                <Form.Label>Dataset</Form.Label>
                            </div>
                            <Row>
                                <Col md={7}>
                                    <Form.Control placeholder='dataset name'/>
                                </Col>
                                <Col md={3}>
                                    <FileFacade accept='.csv'>
                                        Browse
                                    </FileFacade>
                                </Col>
                                <Col md={2}>
                                    <Button className='btn btn-secondary'>
                                        Upload
                                    </Button>
                                </Col>
                            </Row>
                            <div className='form-label-wrapper'>
                                <Form.Label>Graph</Form.Label>
                            </div>
                            <Row>
                                <Col md={7}>
                                    <Form.Control placeholder='graph name'/>
                                </Col>
                                <Col md={3}>
                                    <FileFacade accept='.json'>
                                        Browse
                                    </FileFacade>
                                </Col>
                                <Col md={2}>
                                    <Button className='btn btn-secondary'>
                                        Upload
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={this.closeUploadModal.bind(this)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
