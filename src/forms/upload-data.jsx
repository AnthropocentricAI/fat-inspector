import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FileFacade from './file-facade.jsx';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Alert from 'react-bootstrap/Alert';
import { jsonWithStatus } from '../util';

export default class UploadData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      displayPopup: false,
      errorMessage: '',
    };
  }

  displayResponse(response) {
    this.setState({
      error: !response.ok,
      displayPopup: true,
      responseMessage: response.json,
    });
    setTimeout(
      () =>
        this.setState({
          displayPopup: false,
        }),
      2500
    );
  }

  submitFile(e, type) {
    e.preventDefault();
    let formData = new FormData(e.target);
    console.log(`Uploading new ${type}...`);
    fetch(`${type}/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(jsonWithStatus)
      .then(r => this.displayResponse(r));
  }

  render() {
    return (
      <div>
        {/* dataset form */}
        <Form onSubmit={e => this.submitFile(e, 'dataset')}>
          <div className="form-label-wrapper">
            <Form.Label>Dataset</Form.Label>
          </div>
          <Row>
            <Col md={7}>
              <Form.Control name="dataset_name" placeholder="dataset name" />
            </Col>
            <Col md={3}>
              <FileFacade inputName="dataset_file" accept=".csv">
                Browse
              </FileFacade>
            </Col>
            <Col md={2}>
              <Button type="submit" className="btn btn-secondary">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
        {/* graph form */}
        <Form onSubmit={e => this.submitFile(e, 'graph')}>
          <div className="form-label-wrapper">
            <Form.Label>Graph</Form.Label>
          </div>
          <Row>
            <Col md={7}>
              <Form.Control name="graph_name" placeholder="graph name" />
            </Col>
            <Col md={3}>
              <FileFacade inputName="graph_file" accept=".json">
                Browse
              </FileFacade>
            </Col>
            <Col md={2}>
              <Button type="submit" className="btn btn-secondary">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
        <Collapse in={this.state.displayPopup}>
          <div>
            {this.state.responseMessage ? (
              <Alert
                className="response-alert"
                variant={this.state.error ? 'danger' : 'success'}
              >
                <span className="response-body">
                  {this.state.responseMessage.message}
                </span>
              </Alert>
            ) : null}
          </div>
        </Collapse>
      </div>
    );
  }
}
