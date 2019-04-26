import React from 'react';
import ReactDOM from 'react-dom';
import { Graph } from 'react-d3-graph';
import defaultConfig from './config';
import uuid from 'uuid/v4';
import NodePopover from './node-popover.jsx';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Topbar from '../topbar/topbar.jsx';
import { jsonOkRequired, jsonWithStatus } from '../util';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import BackButton from './back-button.jsx';
import Alert from 'react-bootstrap/Alert';

library.add(faBolt);

export default class Tool extends React.Component {
  constructor(props) {
    super(props);

    const config = defaultConfig;

    this.state = {
      config,
      edit: false,
      functions: [],
      nodeClickedId: false,
      showApply: false,
      displayMessage: false,
      message: { variant: '', text: '' },
    };

    // NOTE: https://github.com/danielcaldas/react-d3-graph/issues/138
    // we need this ref to highlight a particular node in the graph
    this.graph = React.createRef();

    this.onClickNode = this.onClickNode.bind(this);
    this.onClickGraph = this.onClickGraph.bind(this);
    this.createChild = this.createChild.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.editNode = this.editNode.bind(this);
    this.getNodeData = this.getNodeData.bind(this);
    this.executeFunctions = this.executeFunctions.bind(this);
    this.convertToModel = this.convertToModel.bind(this);
    this.backToData = this.backToData.bind(this);
  }

  // upon first mount, we need to populate the graph and fetch relevant data
  componentDidMount() {
    this.fetchFunctions();
    this.populateGraph(this.props.isNew);
  }

  fetchFunctions() {
    fetch('/graph/functions')
      .then(jsonWithStatus)
      .then(r => {
        if (!r.ok) throw new Error('Failed to get functions!');
        this.setState({
          functions: r.json,
        });
      })
      .catch(console.error);
  }

  initEmptyGraph() {
    const rootNode = {
      id: uuid(),
      label: 'root',
      x: this.state.config.width / 2,
      y: this.state.config.height / 2,
    };
    this.setState({
      root: rootNode.id,
      data: {
        nodes: [rootNode],
        links: [],
      },
    });
  }

  populateGraph(isNew) {
    if (isNew) {
      this.initEmptyGraph();
    } else {
      fetch(`/graph/${this.props.match.params.graph}/fetch`)
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
    }
  }

  onClickNode(id) {
    this.setState({
      nodeClickedId: id,
    });
    // set node to front of svg
    let nodeElement = document.getElementById(id);
    nodeElement.parentNode.appendChild(nodeElement);
  }

  onClickGraph() {
    // deselect popup if open
    if (this.state.nodeClickedId) this.setState({ nodeClickedId: null });
  }

  editNode(nodeId, node) {
    this.setState({
      data: {
        nodes: this.state.data.nodes.map(x =>
          x.id === nodeId
            ? {
              ...x,
              label: node.label || x.label,
              desc: node.desc || x.desc,
              function: {
                name: node.function.name || x.function.name,
                indices: node.function.indices || x.function.indices,
                axis: node.function.axis || x.function.axis,
              },
            }
            : x
        ),
        links: this.state.data.links,
      },
    });
  }

  convertToModel(nodeID) {

    this.props.history.push({
      pathname: `/tool/${this.props.match.params.dataset}/${
        this.props.match.params.graph
        }/${
        this.props.match.params.model
        }`,
    });
  }

  deleteNode(nodeId) {
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
      data: {
        nodes: nodes,
        links: links,
      },
    });
  }

  // gets data in payload for a given node
  // gross but the only way :(
  getNodeData(nodeId) {
    if (!this.state.data) return null;
    for (let x of this.state.data.nodes) if (x.id === nodeId) return x;
    return null;
  }

  createChild(parent, node) {
    const child_id = uuid();
    this.setState((prev, props) => {
      return {
        showApply: false,
        data: {
          nodes: [...prev.data.nodes, { id: child_id, ...node }],
          links: [...prev.data.links, { source: parent, target: child_id }],
        },
      };
    });
  }

  backToData() {
    this.props.history.push({
      pathname: `/tool/${this.props.match.params.dataset}/${
        this.props.match.params.graph
        }`,
    });
  }

  executeFunctions() {
    fetch(
      `/execute/${this.props.match.params.dataset}/${
      this.props.match.params.graph
      }`,
      { method: 'POST' }
    )
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
  }

  render() {
    const graphProps = {
      id: 'graph',
      data: this.state.data,
      config: this.state.config,
      onClickNode: this.onClickNode,
      onClickGraph: this.onClickGraph,
    };

    // portal from children of node  element
    const Portal = ({ children }) => {
      return ReactDOM.createPortal(
        children,
        document.getElementById(this.state.nodeClickedId)
      );
    };

    const node = this.getNodeData(this.state.nodeClickedId);

    return (
      <div>
        <Topbar graph={this.props.match.params.graph} data={this.state.data} />
        <div className="data-info">
          <h4>Dataset: {this.props.match.params.dataset}</h4>
          <h4>Graph: {this.props.match.params.graph}</h4>
        </div>
        <button className="apply-functions" onClick={this.executeFunctions}>
          <FontAwesomeIcon icon="bolt" size="lg" />
          <h5>Execute Functions</h5>
        </button>
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
        )}
        {/* display popup */}
        {node && (
          <Portal>
            <foreignObject
              x="30"
              y="-15"
              width="225px"
              height="100%"
              className="click-through"
            >
              <NodePopover
                functions={this.state.functions}
                node={node}
                onApply={this.createChild}
                onEdit={this.editNode}
                onDelete={this.deleteNode}
                dataset={this.props.match.params.dataset}
                mode={this.props.mode}
                convert={this.convertToModel}
                graph={this.props.match.params.graph}
              />
            </foreignObject>
          </Portal>
        )}
        {(this.props.mode == 'model-graph') && (
          <BackButton mode={this.props.mode} backFunction={this.backToData} />
        )}
      </div>
    );
  }
}

Tool.propTypes = {
  isNew: PropTypes.bool,
};
