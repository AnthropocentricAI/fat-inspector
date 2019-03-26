import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import UploadData from './upload-data.jsx';
import Collapse from 'react-bootstrap/Collapse';
import PropTypes from 'prop-types';

export default class FileChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      uploadModal: false,
      poppedOut: false,
      existingGraph: false,
      newGraph: false
    };
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

  openGraph(e) {
    // this feels wrong
    e.preventDefault();
    let formData = new FormData(e.target);
    let dataset = formData.get('dataset');
    let graph = this.state.newGraph ? formData.get('graphName') : formData.get('graph');
    this.props.history.push({
      pathname: '/tool',
      search: `?dataset=${dataset}&graph=${graph}&isNew=${this.state.newGraph}`
    });
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
          <Form onSubmit={this.openGraph.bind(this)}>
            <div className="form-label-wrapper">
              <Form.Label>Dataset</Form.Label>
            </div>
            <Form.Control as='select'
                          name='dataset'
                          defaultValue={-1}>
              <option disabled hidden value={-1}>Select a dataset...</option>
              {
                this.state.datasets.map(d => <option key={d}>{d}</option>)
              }
            </Form.Control>
            <Form.Group className='file-chooser-radios'>
              <Form.Check custom
                          inline
                          type='radio'
                          label='Select an existing graph'
                          id='radioExistingGraph'
                          name='radioExistingGraph'
                          onChange={e => this.setState({
                            poppedOut: true,
                            existingGraph: true,
                            newGraph: false
                          })}/>
              <Form.Check custom
                          inline
                          type='radio'
                          label='Create a new graph'
                          id='radioCreateGraph'
                          name='radioExistingGraph'
                          onChange={e => this.setState({
                            poppedOut: true,
                            existingGraph: false,
                            newGraph: true
                          })}/>
            </Form.Group>
            <Collapse in={this.state.poppedOut}>
              {
                this.state.newGraph ?
                  <div>
                    <div className="form-label-wrapper">
                      <Form.Label>New Graph</Form.Label>
                    </div>
                    <Form.Control name='graphName'
                                  placeholder='New graph name...'/>
                  </div> :
                  <div>
                    <div className="form-label-wrapper">
                      <Form.Label>Select Graph</Form.Label>
                    </div>
                    <Form.Control as='select'
                                  name='graph'
                                  defaultValue={-1}>
                      <option disabled hidden value={-1}>Select a graph...</option>
                      // TODO: add server side graphs
                    </Form.Control>
                  </div>
              }
            </Collapse>
            <div className="form-wrapper-centre">
              <Button type='submit' variant='primary'>
                Open Graph
              </Button>
              <Button onClick={() => this.setState({showUpload: true})} variant='link'>
                Upload Custom
              </Button>
            </div>
          </Form>
        </div>
        <Modal show={this.state.showUpload}
               onHide={() => this.setState({showUpload: false})}
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

FileChooser.propTypes = {
  onSubmit: PropTypes.func
};