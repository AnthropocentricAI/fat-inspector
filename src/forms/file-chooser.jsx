import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import UploadData from './upload-data.jsx';
import PropTypes from 'prop-types';

export default class FileChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      uploadModal: false,
      newGraphChecked: false
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
    let graph = this.state.newGraphChecked ? formData.get('graphName') : formData.get('graph');
    this.props.onOpenGraph(dataset, graph, this.state.newGraphChecked);
  }

  updateIsChecked(e) {
    this.setState({
      ...this.state,
      newGraphChecked: e.target.checked
    })
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
            <div className="form-label-wrapper">
              <Form.Label>Graph</Form.Label>
            </div>
            <Form.Control as='select'
                          disabled={this.state.newGraphChecked}
                          name='graph'
                          defaultValue={-1}>
              <option disabled hidden value={-1}>Select a graph...</option>
              // TODO: add server side graphs
            </Form.Control>
            <Form.Check label='Create a new graph'
                        name='newGraphCheck'
                        onChange={this.updateIsChecked.bind(this)}/>
            <Form.Control name='graphName'
                          placeholder='New graph name...'
                          disabled={!this.state.newGraphChecked}/>
            <div className="form-wrapper-parent">
              <div className="form-wrapper-centre">

                <Button type='submit' variant='primary'>
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

FileChooser.propTypes = {
  onOpenGraph: PropTypes.func
};