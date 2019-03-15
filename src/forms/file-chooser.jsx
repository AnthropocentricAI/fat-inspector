import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import UploadData from './upload-data.jsx';

export default class FileChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datasets: [],
            uploadModal: false
        };
    }

    openUploadModal() {
        this.setState({
            ...this.state,
            uploadModal: true
        });
    }

    closeUploadModal() {
        this.setState({
            ...this.state,
            uploadModal: false
        });
    }

    openGraph() {
        alert('TODO')
    }

    fetchDatasets() {
        fetch('/dataset/view', {
            method: 'GET'
        }).then(r => {
            if (r.status !== 200) {
                console.error('Failed to get a list of datasets from the server!');
                return;
            }
            r.json().then(data => {
                this.setState({
                    ...this.state,
                    datasets: data
                });
            });
        }, e => console.error(e));
    }

    componentWillMount() {
        // on load, ask the server for a list of datasets
        // TODO: add graph fetching too
        this.fetchDatasets();
    }

    render() {
        return (
            <div>
                <div className='file-chooser-wrapper'>
                    <Form>
                        <div className="form-label-wrapper">
                            <Form.Label>Dataset</Form.Label>
                        </div>
                        <Form.Control as='select'>
                            <option disabled selected hidden>Select a dataset...</option>
                            {
                                this.state.datasets.map(d => <option key={d}>{d}</option>)
                            }
                        </Form.Control>
                        <div className="form-label-wrapper">
                            <Form.Label>Graph</Form.Label>
                        </div>
                        <Form.Control as='select'>
                            <option selected value='new-graph'>Create new graph</option>
                            // TODO: add server side graphs
                        </Form.Control>
                        <div className="form-wrapper-parent">
                            <div className="form-wrapper-centre">
                                <Button onClick={this.openGraph.bind(this)} variant='primary'>
                                    Open Graph
                                </Button>
                                <Button onClick={this.openUploadModal.bind(this)} variant='link'>
                                    Upload Custom
                                </Button>
                            </div>
                        </div>
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
                        <UploadData/>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}