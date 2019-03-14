import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FileFacade from './file-facade.jsx';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Alert from 'react-bootstrap/Alert';

export default class UploadData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            displayPopup: false,
            errorMessage: ''
        }
    }

    displayResponse(message) {
        message.text().then(t => {
            this.setState({
                ...this.state,
                // if status is not 200 display error popup rather than success
                error: message.status !== 200,
                displayPopup: true,
                responseMessage: JSON.parse(t)
            });
        });
        setTimeout(() => this.setState({
            ...this.state,
            displayPopup: false
        }), 2500);
    }

    onSubmitDataset(e) {
        // stop normal form submission
        e.preventDefault();
        let formData = new FormData(e.target);
        console.log(`Uploading dataset ${formData.get('dataset_name')}...`);
        fetch('dataset/upload', {
            method: 'POST',
            body: formData,
        }).then(r => this.displayResponse(r), e => this.displayResponse(e));
    }

    onSubmitGraph(e) {
        // TODO: Implement graph uploading
        alert('TODO')
    }

    render() {
        return (
            <div>
                { /* dataset form */}
                <Form onSubmit={this.onSubmitDataset.bind(this)}>
                    <div className="form-label-wrapper">
                        <Form.Label>Dataset</Form.Label>
                    </div>
                    <Row>
                        <Col md={7}>
                            <Form.Control name='dataset_name' placeholder='dataset name'/>
                        </Col>
                        <Col md={3}>
                            <FileFacade inputName='dataset_file' accept='.csv'>
                                Browse
                            </FileFacade>
                        </Col>
                        <Col md={2}>
                            <Button type='submit' className='btn btn-secondary'>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
                { /* graph form */}
                <Form onSubmit={this.onSubmitGraph.bind(this)}>
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
                            <Button type='submit' className='btn btn-secondary'>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Collapse in={this.state.displayPopup}>
                    <div>
                        {
                            this.state.responseMessage ?
                            <Alert className='response-alert'
                                   variant={this.state.error ? 'danger' : 'success'}>
                                <span className='response-body'>{this.state.responseMessage.message}</span>
                            </Alert> : null
                        }
                    </div>
                </Collapse>
            </div>
        )
    }
}