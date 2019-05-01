import React from 'react';
import ReactDOM from 'react-dom';
import config1 from './config';
import config2 from './config1';
import config3 from './config2';
import uuid from 'uuid/v4';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Topbar from '../topbar/topbar.jsx';
import { jsonOkRequired, jsonWithStatus } from '../util';
import { faBolt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import BackButton from './back-button.jsx';
import Alert from 'react-bootstrap/Alert';
import NodePopover from './node-popover.jsx';
import { Prompt } from 'react-router-dom';
import loadable from '@loadable/component';
import moment from 'moment';
import Rename from '../modals/modal-rename.jsx';
import Button from 'react-bootstrap/Button';

library.add(faBolt);
library.add(faArrowLeft);
const Graph = loadable(() => import('react-d3-graph').then(m => m.Graph), {
  fallback: (
    <div className="graph-loading">
      <Spinner animation="border" role="status" />
    </div>
  ),
});

export default class Tool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blockUnload: false,
      displayMessage: false,
      functions: [],
      message: { variant: '', text: '' },
      mode: '',
    };
    // NOTE: https://github.com/danielcaldas/react-d3-graph/issues/138
    // we need this ref to highlight a particular node in the graph
    this.graph = React.createRef();
  }

  // upon first mount, we need to populate the graph and fetch relevant data
  componentDidMount() {
    this.fetchFunctions();

    let parsedMode = '';
    if (this.props.match.params.prediction) {
      parsedMode = 'prediction';
    } else if (this.props.match.params.model) {
      parsedMode = 'model';
    } else if (this.props.match.params.graph) {
      parsedMode = 'data';
    }

    this.setState({ mode: parsedMode }, () => this.populateGraph());
  }

  fetchFunctions = () => {
    fetch('/graph/functions')
      .then(jsonOkRequired)
      .then(data => {
        this.setState({
          functions: data,
        });
      })
      .catch(console.error);
  };

  findRoot = graph => {
    const targets = graph.links.map(({ source, target }) => target);
    const roots = graph.nodes.filter(x => !targets.includes(x));
    return roots[0].id;
  };

  populateGraph = () => {
    let graphId = '';
    if (this.state.mode === 'data') {
      graphId = this.props.match.params.graph;
    } else if (this.state.mode === 'model') {
      graphId = this.props.match.params.model;
    } else if (this.state.mode === 'prediction') {
      graphId = this.props.match.params.prediction;
    }

    fetch(`/graph/${graphId}/createAndFetch`)
      .then(jsonWithStatus)
      .then(r => {
        if (!r.ok) this.props.history.push('/');
        else {
          this.setState({
            data: {
              ...r.json,
            },
          });
        }
      });
  };

  // returns graph id based on data/model/prediction
  getGraphId = () => {
    if (this.state.mode === 'data') {
      return this.props.match.params.graph;
    } else if (this.state.mode === 'model') {
      return this.props.match.params.model;
    } else if (this.state.mode === 'prediction') {
      return this.props.match.params.prediction;
    }
  };

  onClickNode = id => {
    this.setState({
      nodeClickedId: id,
    });
    // set node to front of svg
    let nodeElement = document.getElementById(id);
    nodeElement.parentNode.appendChild(nodeElement);
  };

  onClickGraph = () => {
    // deselect popup if open
    if (this.state.nodeClickedId) this.setState({ nodeClickedId: null });
  };

  editNode = (nodeId, node) => {
    const func = node.function && {
      name: node.function.name || x.function.name,
      indices: node.function.indices || x.function.indices,
      axis: node.function.axis >= 0 ? node.function.axis : x.function.axis,
    };
    this.setState({
      blockUnload: true,
      data: {
        nodes: this.state.data.nodes.map(x =>
          x.id === nodeId
            ? {
                ...x,
                label: node.label || x.label,
                desc: node.desc,
                function: func,
              }
            : x
        ),
        links: this.state.data.links,
      },
    });
  };

  convertToModel = nodeId => {
    fetch(`/graph/${this.props.match.params.graph}/save`, {
      method: 'POST',
      body: JSON.stringify(this.state.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(jsonOkRequired)
      .then(j => {
        console.log(j.message);

        // pickle model on server side
        fetch(
          `/model/${this.props.match.params.dataset}/${
            this.props.match.params.graph
          }/${nodeId}/save`,
          {
            method: 'POST',
          }
        ).then(j => {
          // TODO: should prob put error checking at sometime lol
          // change page
          this.props.history.push({
            pathname: `/tool/${this.props.match.params.dataset}/${
              this.props.match.params.graph
            }/${nodeId}`,
          });
        });
      })
      .catch(console.error);
  };

  convertToPrediction = nodeId => {
    fetch(`/graph/${this.props.match.params.model}/save`, {
      method: 'POST',
      body: JSON.stringify(this.state.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(jsonOkRequired)
      .then(j => {
        console.log(j.message);
        this.props.history.push({
          pathname: `/tool/${this.props.match.params.dataset}/${
            this.props.match.params.graph
          }/${this.props.match.params.model}/${nodeId}`,
        });
      })
      .catch(console.error);
  };

  deleteNode = nodeId => {
    if (nodeId === this.state.root) return;
    let toDelete = [nodeId];
    // shallow copy the arrays
    let nodes = [...this.state.data.nodes];
    let links = [...this.state.data.links];
    // TODO: refine this at a later date - VERY inefficient 24/03/2019
    while (toDelete.length) {
      let currentId = toDelete.pop();
      // remove the node from the list
      nodes = nodes.filter(x => x.id !== currentId);
      // push all of the connected nodes to toDelete
      toDelete.push(
        ...links.filter(x => x.source === currentId).map(x => x.target)
      );
      // remove all of the links which involve currentId
      links = links.filter(
        x => x.source !== currentId && x.target !== currentId
      );
    }
    this.setState({
      blockUnload: true,
      data: {
        nodes: nodes,
        links: links,
      },
    });
  };

  // gets data in payload for a given node
  // gross but the only way :(
  getNodeData = nodeId => {
    if (!this.state.data) return null;
    for (let x of this.state.data.nodes) if (x.id === nodeId) return x;
    return null;
  };

  createChild = (parent, node) => {
    const child_id = uuid();
    this.setState((prev, props) => {
      return {
        blockUnload: true,
        showApply: false,
        data: {
          nodes: [...prev.data.nodes, { id: child_id, ...node }],
          links: [...prev.data.links, { source: parent, target: child_id }],
        },
      };
    });
  };

  backToData = () => {
    fetch(`/graph/${this.props.match.params.model}/save`, {
      method: 'POST',
      body: JSON.stringify(this.state.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(jsonOkRequired)
      .then(j => {
        console.log(j.message);
        this.props.history.push({
          pathname: `/tool/${this.props.match.params.dataset}/${
            this.props.match.params.graph
          }`,
        });
      })
      .catch(console.error);
  };

  backToModel = () => {
    fetch(`/graph/${this.props.match.params.prediction}/save`, {
      method: 'POST',
      body: JSON.stringify(this.state.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(jsonOkRequired)
      .then(j => {
        console.log(j.message);
        this.props.history.push({
          pathname: `/tool/${this.props.match.params.dataset}/${
            this.props.match.params.graph
          }/${this.props.match.params.model}`,
        });
      })
      .catch(console.error);
  };

  executeFunctions = () => {
    fetch(`/graph/${this.getGraphId()}/save`, {
      method: 'POST',
      body: JSON.stringify(this.state.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(jsonOkRequired)
      .then(({ message }) => {
        console.log(message);
        this.setState({
          blockUnload: false,
        });
      })
      .then(() => {
        if (this.state.mode === 'data') {
          return fetch(
            `/execute/${this.props.match.params.dataset}/${
              this.props.match.params.graph
            }/data`,
            { method: 'POST' }
          );
        } else if (this.state.mode === 'model') {
          return fetch(
            `/execute/${this.props.match.params.dataset}/${
              this.props.match.params.graph
            }/${this.props.match.params.model}/model`,
            { method: 'POST' }
          );
        } else if (this.state.mode === 'prediction') {
          // uhh
        }
      })
      .then(jsonWithStatus)
      .then(({ ok, json }) => {
        this.setState(
          {
            displayMessage: true,
            message: {
              variant: ok ? 'success' : 'danger',
              text: json.message,
            },
          },
          () => {
            // this needs to be set after state change because the state
            // change will overwrite the highlighted value
            json.node &&
              this.graph.current._setNodeHighlightedValue(json.node, true);
            setTimeout(() => {
              this.setState({ displayMessage: false });
            }, 2500);
          }
        );
      });
  };

  saveGraph = () => {
    return fetch(`/graph/${this.props.match.params.graph}/save`, {
      method: 'POST',
      body: JSON.stringify(this.state.data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(jsonOkRequired)
      .then(({ message }) => {
        console.log(message);
        this.setState({
          lastSaved: moment(),
          blockUnload: false,
        });
      })
      .catch(console.error);
  };

  showRename = () => {
    this.setState({ showRename: true });
  };

  showDuplicate = () => {
    this.setState({ showDuplicate: true });
  };

  renameGraph = name => {
    fetch(`/graph/${this.props.match.params.graph}/rename`, {
      method: 'POST',
      body: `new_name=${name}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then(jsonOkRequired)
      .then(data => {
        console.log(data);
        this.props.history.replace(
          `/tool/${this.props.match.params.dataset}/${name}`
        );
      });
  };

  duplicateGraph = name => {
    fetch(`/graph/${this.props.match.params.graph}/duplicate`, {
      method: 'POST',
      body: `new_name=${name}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then(jsonOkRequired)
      .then(data => {
        console.log(data);
        this.props.history.replace(
          `/tool/${this.props.match.params.dataset}/${name}`
        );
      });
  };

  render() {
    // set up the "Are you sure?" prompt if the graph hasn't been saved
    window.onbeforeunload = this.state.blockUnload ? () => true : null;
    const node = this.getNodeData(this.state.nodeClickedId);
    const graphProps = {
      id: 'graph',
      data: this.state.data,
      onClickNode: this.onClickNode,
      onClickGraph: this.onClickGraph,
    };

    const topbarGraphItems = [
      { text: 'Save', onClick: this.saveGraph },
      {
        text: 'Download',
        href: `/graph/${this.props.match.params.graph}/download`,
        target: '_blank',
      },
      { text: 'Rename', onClick: this.showRename },
      { text: 'Duplicate', onClick: this.showDuplicate },
    ];

    //console.log(this.props.match.params.model);

    const popoverProps = {
      dataset: this.props.match.params.dataset,
      graph: this.props.match.params.graph,
      model: this.props.match.params.model,
      //graph: this.getGraphId(),
      functions: this.state.functions,
      node: node,
      mode: this.state.mode,
      models: this.convertToModel,
      predictions: this.convertToPrediction,
      onApply: this.createChild,
      onEdit: this.editNode,
      onDelete: this.deleteNode,
    };

    // portal from children of node  element
    const Portal = ({ children }) => {
      return ReactDOM.createPortal(
        children,
        document.getElementById(this.state.nodeClickedId)
      );
    };

    if (this.state.mode === 'data') {
      graphProps['config'] = config1;
    } else if (this.state.mode === 'model') {
      graphProps['config'] = config2;
    } else if (this.state.mode === 'prediction') {
      graphProps['config'] = config3;
    }

    const info = this.state.datasetInfo
      ? [
          { attr: 'Title', content: this.props.match.params.dataset },
          { attr: '# of Axes', content: this.state.datasetInfo.noOfAxes },
          {
            attr: '# of Indices',
            content: this.state.datasetInfo.noOfIndices,
          },
        ]
      : [];

    return (
      // TODO: look at bundle sizes
      <div>
        <Prompt
          when={this.state.blockUnload}
          message="Are you sure? Changes that you made may not be saved."
        />
        <Topbar
          graph={this.props.match.params.graph}
          dataset={this.props.match.params.dataset}
          mode={this.state.mode}
          items={topbarGraphItems}
        />
        {this.state.mode === 'data' && (
          <h1 className="mode-label">Data Graph</h1>
        )}
        {this.state.mode === 'model' && (
          <h1 className="mode-label">Model Graph</h1>
        )}
        {this.state.mode === 'prediction' && (
          <h1 className="mode-label">Predictions Graph</h1>
        )}
        <div className="graph-wrapper">
          {this.state.data ? (
            <Graph ref={this.graph} {...graphProps} />
          ) : (
            <div className="graph-loading">
              <Spinner animation="border" role="status" />
            </div>
          )}
          <Alert
            variant={this.state.message.variant}
            dismissible
            show={this.state.displayMessage}
            className="bottom-popup"
            onClose={() => this.setState({ displayMessage: false })}
          >
            {this.state.message.text}
          </Alert>
        </div>

        {/* display popup */}
        {node && (
          <Portal>
            <foreignObject
              x="30"
              y="-15"
              width="100%"
              height="100%"
              className="click-through"
            >
              <NodePopover {...popoverProps} />
            </foreignObject>
          </Portal>
        )}
        <Rename
          title="Rename Graph"
          onSubmit={this.renameGraph}
          onHide={() => this.setState({ showRename: false })}
          show={this.state.showRename}
        />
        <Rename
          title="Duplicate Graph"
          onSubmit={this.duplicateGraph}
          onHide={() => this.setState({ showDuplicate: false })}
          show={this.state.showDuplicate}
        />
        <div className="information-banner">
          <div>
            {info.map(({ attr, content }) => (
              <p key={`dataset-info-${attr}`} className="dataset-info">
                <span className="dataset-info-attr">{attr}</span>: {content}
              </p>
            ))}
          </div>
          <div className="banner-button-wrapper">
            {this.state.mode === 'data' && (
              <Button
                className="execute-function-button-data"
                variant="primary"
                onClick={this.executeFunctions}
              >
                <FontAwesomeIcon icon="bolt" size="lg" />
                <span className="banner-button-text">Execute Functions</span>
              </Button>
            )}
            {this.state.mode === 'model' && (
              <Button
                className="execute-function-button-model"
                variant="primary"
                onClick={this.executeFunctions}
              >
                <FontAwesomeIcon icon="bolt" size="lg" />
                <span className="banner-button-text">Execute Functions</span>
              </Button>
            )}
            {this.state.mode === 'prediction' && (
              <Button
                className="execute-function-button-prediction"
                variant="primary"
                onClick={this.executeFunctions}
              >
                <FontAwesomeIcon icon="bolt" size="lg" />
                <span className="banner-button-text">Execute Functions</span>
              </Button>
            )}
          </div>
          <div className="timer">
            {this.state.lastSaved && `Saved ${this.state.lastSaved.fromNow()}`}
          </div>
        </div>
        <BackButton
          mode={this.state.mode}
          backFunctionData={this.backToData}
          backFunctionModel={this.backToModel}
        />
      </div>
    );
  }
}

Tool.propTypes = {
  isNew: PropTypes.bool,
};
