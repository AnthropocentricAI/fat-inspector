import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import UploadData from './upload-data.jsx';
import Collapse from 'react-bootstrap/Collapse';
import PropTypes from 'prop-types';
import { jsonOkRequired } from '../util';

export default class FileChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      graphs: [],
      uploadModal: false,
      poppedOut: false,
      existingGraph: false,
      newGraph: false,
    };
  }

  fetchLists() {
    fetch('/dataset/view')
      .then(jsonOkRequired)
      .then(data => this.setState({ datasets: data }))
      .catch(console.error);
    fetch('/graph/view')
      .then(jsonOkRequired)
      .then(data => this.setState({ graphs: data }))
      .catch(console.error);
  }

  openGraph(e) {
    // this feels wrong
    e.preventDefault();
    let formData = new FormData(e.target);
    let dataset = formData.get('dataset');
    let graph = this.state.newGraph
      ? formData.get('graphName')
      : formData.get('graph');
    this.props.onSubmit(dataset, graph, this.state.newGraph);
    this.props.history.push({
      pathname: `/tool/${dataset}/${graph}`,
    });
  }

  componentDidMount() {
    this.fetchLists();
  }

  render() {
    return (
      <div>
        <div className="file-chooser-wrapper">
          <div className="title">
            Welcome to FAT Forensics inspect tool
            <p>AnthropocentricAI</p>
          </div>
          <Form onSubmit={this.openGraph.bind(this)}>
            <div className="form-label-wrapper">
              <Form.Label>Dataset</Form.Label>
            </div>
            <Form.Control as="select" name="dataset" defaultValue={-1}>
              <option disabled hidden value={-1}>
                Select a dataset...
              </option>
              {this.state.datasets.map(d => (
                <option key={`dataset-${d}`}>{d}</option>
              ))}
            </Form.Control>
            <Form.Group className="file-chooser-radios">
              <Form.Check
                custom
                inline
                type="radio"
                label="Select an existing graph"
                id="radioExistingGraph"
                name="radioExistingGraph"
                onChange={e =>
                  this.setState({
                    poppedOut: true,
                    existingGraph: true,
                    newGraph: false,
                  })
                }
              />
              <Form.Check
                custom
                inline
                type="radio"
                label="Create a new graph"
                id="radioCreateGraph"
                name="radioExistingGraph"
                onChange={e =>
                  this.setState({
                    poppedOut: true,
                    existingGraph: false,
                    newGraph: true,
                  })
                }
              />
            </Form.Group>
            <Collapse in={this.state.poppedOut}>
              {this.state.newGraph ? (
                <div>
                  <div className="form-label-wrapper">
                    <Form.Label>New Graph</Form.Label>
                  </div>
                  <Form.Control
                    name="graphName"
                    placeholder="New graph name..."
                  />
                </div>
              ) : (
                <div>
                  <div className="form-label-wrapper">
                    <Form.Label>Select Graph</Form.Label>
                  </div>
                  <Form.Control as="select" name="graph" defaultValue={-1}>
                    <option disabled hidden value={-1}>
                      Select a graph...
                    </option>
                    {this.state.graphs.map(g => (
                      <option key={`graph-${g}`}>{g}</option>
                    ))}
                  </Form.Control>
                </div>
              )}
            </Collapse>
            <div className="form-wrapper-centre">
              <Button type="submit" variant="primary">
                Open Graph
              </Button>
              <Button
                onClick={() => this.setState({ showUpload: true })}
                variant="link"
              >
                Upload Custom
              </Button>
            </div>
          </Form>
        </div>
        <Modal
          show={this.state.showUpload}
          onHide={() => this.setState({ showUpload: false })}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Upload Dataset/Graph</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UploadData />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

FileChooser.propTypes = {
  onSubmit: PropTypes.func,
};
