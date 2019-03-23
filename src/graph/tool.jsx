import React from "react";
import ReactDOM from "react-dom";
import {Graph} from 'react-d3-graph';
import defaultConfig from './config';
import uuid from 'uuid/v4';
import NodePopover from './node-popover.jsx';
import PropTypes from 'prop-types';



export default class Tool extends React.Component {
  constructor(props) {
    super(props);

    const config = defaultConfig;
    const nodeClickedId = false;

    this.state = {
      config,
      nodeClickedId,
      functions: [],
      edit: false,
      showApply: false
    };

    this.onClickNode = this.onClickNode.bind(this);
    this.onClickGraph = this.onClickGraph.bind(this);
    this.createChild = this.createChild.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.editNodeLabelDesc = this.editNodeLabelDesc.bind(this);
    this.getNodeData = this.getNodeData.bind(this);
  }

  fetchFunctions() {
    // ask the server for a the list of node functions
    fetch('/graph/functions')
      .then(r => {
        if (r.status !== 200) {
          console.error('Error when attempting to fetch functions!');
        }
        r.json().then(data => {
          this.setState({
            functions: data
          }, () => console.log(this.state));
        });
      }, e => {
        console.error(e)
      });
  }

  populateGraph() {
    // TODO: better way to make new graph & fetch graphs - 22/03/2019
    if (this.props.isNew) {
      const rootNode = {
        id: uuid(),
        label: 'root'
      };
      this.setState({
        data: {
          nodes: [rootNode],
          links: []
        }
      });
    }
  }

  componentWillMount() {
    this.fetchFunctions();
    this.populateGraph();
  }

  onClickNode(id) {
    this.setState({
      nodeClickedId: id
    });
    // set node to front of svg
    let nodeElement = document.getElementById(id);
    nodeElement.parentNode.appendChild(nodeElement);
  }

  onClickGraph() {
    // deselect popup if open
    if (this.state.nodeClickedId) this.setState({nodeClickedId: null});
  }

  editNodeLabelDesc(nodeId, label, desc) {
    this.setState({
      data: {
        nodes: this.state.data.nodes.map(x => x.id === nodeId ? {
          ...x,
          label: label || x.label,
          desc: desc || x.desc
        } : x),
        links: this.state.data.links
      }
    });
  }

  deleteNode() {}

  // gets data in payload for a given node
  // gross but the only way :(
  getNodeData(nodeId) {
    for (let x of this.state.data.nodes) if (x.id === nodeId) return x;
    return null;
  }

  createChild(parent, child, desc, func) {
    const child_id = uuid();
    this.setState((prev, props) => {
      return {
        showApply: false,
        data: {
          nodes: [...prev.data.nodes, {id: child_id, label: child, desc: desc, func: func}],
          links: [...prev.data.links, {source: parent, target: child_id}]
        }
      }
    })
  }

  render() {
    const graphProps = {
      id: 'graph',
      data: this.state.data,
      config: this.state.config,
      onClickNode: this.onClickNode,
      onClickGraph: this.onClickGraph
    };

    // portal from children of node  element
    const Portal = ({children}) => {
      return ReactDOM.createPortal(
        children,
        document.getElementById(this.state.nodeClickedId)
      );
    };

    const node = this.getNodeData(this.state.nodeClickedId);

    return (
      <div>
        <h3>Dataset: {this.props.dataset}</h3>
        <h3>Graph: {this.props.graph}</h3>
        <Graph ref="graph" {...graphProps} />
        {/* display popup */}
        {/* TODO: add delete */}
        {
          node &&
          <Portal>
            <foreignObject x="30" y="-15" width="200px" height="100%" className='click-through'>
              <NodePopover functions={this.state.functions}
                           node={node}
                           onApply={this.createChild}
                           onEdit={this.editNodeLabelDesc}
                           onDelete={this.deleteNode}/>
            </foreignObject>
          </Portal>
        }
      </div>
    );
  }
}

Tool.propTypes = {
  dataset: PropTypes.string.isRequired,
  graph: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired
};