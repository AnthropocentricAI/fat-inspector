import React from 'react';
import ReactDOM from 'react-dom';
import defaultConfig from './config';
import uuid from 'uuid/v4';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Topbar from '../topbar/topbar.jsx';
import { jsonOkRequired, jsonWithStatus } from '../util';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import BackButton from './back-button.jsx';
import Alert from 'react-bootstrap/Alert';
import NodePopover from './node-popover.jsx';
import { Prompt } from 'react-router-dom';
import loadable from '@loadable/component';
import Modal from 'react-bootstrap/Modal';
import Rename from '../modals/modal-rename.jsx';
import Button from 'react-bootstrap/Button';

library.add(faBolt);
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
      config: defaultConfig,
      blockUnload: false,
      displayMessage: false,
      functions: [],
      message: { variant: '', text: '' },
    };
    // NOTE: https://github.com/danielcaldas/react-d3-graph/issues/138
    // we need this ref to highlight a particular node in the graph
    this.graph = React.createRef();
  }

  // upon first mount, we need to populate the graph and fetch relevant data
  componentDidMount() {
    this.fetchFunctions();
    this.populateGraph(this.props.isNew);
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

  initEmptyGraph = () => {
    const rootNode = {
      id: uuid(),
      label: 'root',
      x: this.state.config.width / 2,
      y: this.state.config.height / 2,
    };
    this.setState({
      blockUnload: true,
      root: rootNode.id,
      data: {
        nodes: [rootNode],
        links: [],
      },
    });
  };

  findRoot = graph => {
    const targets = graph.links.map(({ source, target }) => target);
    const roots = graph.nodes.filter(x => !targets.includes(x));
    return roots[0].id;
  };

  populateGraph = isNew => {
    if (isNew) {
      this.initEmptyGraph();
    } else {
      fetch(`/graph/${this.props.match.params.graph}/fetch`)
        .then(jsonOkRequired)
        .then(json => {
          this.setState({
            data: json,
          });
        })
        .then(() => fetch(`/dataset/${this.props.match.params.dataset}/info`))
        .then(jsonOkRequired)
        .then(json => {
          this.setState({
            datasetInfo: json,
          });
        })
        .catch(e => !console.log(e) && this.props.history.push('/'));
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
      axis: node.function.axis || x.function.axis,
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

  convertToModel = nodeID => {
    this.props.history.push({
      pathname: `/tool/${this.props.match.params.dataset}/${
        this.props.match.params.graph
      }/${this.props.match.params.model}`,
    });
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
    this.props.history.push({
      pathname: `/tool/${this.props.match.params.dataset}/${
        this.props.match.params.graph
      }`,
    });
  };

  executeFunctions = () => {
    fetch(`/graph/${this.props.match.params.graph}/save`, {
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
      .then(() =>
        fetch(
          `/execute/${this.props.match.params.dataset}/${
            this.props.match.params.graph
          }`,
          { method: 'POST' }
        )
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
      config: this.state.config,
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

    const popoverProps = {
      dataset: this.props.match.params.dataset,
      graph: this.props.match.params.graph,
      functions: this.state.functions,
      node: node,
      mode: this.props.mode,
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
        <Topbar items={topbarGraphItems} />
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
            <Button
              className="execute-function-button"
              variant="primary"
              onClick={this.executeFunctions}
            >
              <FontAwesomeIcon icon="bolt" size="lg" />
              <span className="banner-button-text">Execute Functions</span>
            </Button>
          </div>
          <div>Placeholder</div>
        </div>
      </div>
    );
  }
}

Tool.propTypes = {
  isNew: PropTypes.bool,
};
