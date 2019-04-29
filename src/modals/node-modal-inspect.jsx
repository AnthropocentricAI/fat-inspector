import React from 'react';

import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';

import Chart from '../inspect/inspect-chart.jsx';

export default class NodeModalInspect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { id: 'fairness', title: 'Fairness' },
        { id: 'accountability', title: 'Accountability' },
        { id: 'transparency', title: 'Transparency' }
      ],
      chartData: {},
    };
  }

  downloadAllChartTypes = (mode) => {
    return fetch(`/chart/${ mode }/all`).then(r => {
      if (r.status !== 200) {
        console.error(`Error when attempting to fetch chart types for ${ mode }!`);
      }
      return r.json().then(data => {
        this.setState(prev => ({
          ...prev,
          chartData: data
        }));
        return data;
      });
    }, e => console.error(e)); 
  }

  componentDidMount() {
    this.downloadAllChartTypes(this.props.mode);
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} centered dialogClassName="modal__inspect">
        <Modal.Header closeButton>
          <Modal.Title>Inspect {this.props.node.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal__inspect-body">
          <Tabs defaultActiveKey="fairness" id="uncontrolled-tab-example">
            { this.state.tabs.map((tab) =>   
              <Tab key={ tab.id } eventKey={ tab.id } title={ tab.title }>
                { this.state.chartData[tab.id] &&
                  Object.keys(this.state.chartData[tab.id]).map((chartId, i) =>
                    
                    <Chart key={ chartId }
                           mode={ this.props.mode }
                           tab={ tab.id }
                           chartData={ this.state.chartData[tab.id][chartId] }
                           dataset={ this.props.dataset }
                           graph={ this.props.graph }
                           node={ this.props.node.id }>
                    </Chart>
                  )
                }
              </Tab>
            ) }
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NodeModalInspect.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  dataset: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired
};
