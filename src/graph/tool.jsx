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
    const params = new URLSearchParams(this.props.location.search);

    console.log('here');

    this.state = {
      params,
      config,
      nodeClickedId,
      functions: [],
      edit: false,
      showApply: false
    };

    this.populateGraph(true);
    this.fetchFunctions();
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
           this.state = {
             ...this.state,
             functions: data
           };
        }, () => console.log(this.state));
      }, e => console.error(e));
  }

  populateGraph(isNew) {
    // TODO: better way to make new graph & fetch graphs - 22/03/2019
    if (isNew) {
      const rootNode = {
        id: uuid(),
        label: 'root'
      };
      this.state = {
        ...this.state,
        data: {
          nodes: [rootNode],
          links: []
        }
      };
    }
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

  deleteNode(nodeId) {
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
      toDelete.push(...links.filter(x => x.source === currentId).map(x => x.target));
      // remove all of the links which involve currentId
      links = links.filter(x => x.source !== currentId && x.target !== currentId);
    }
    this.setState({
      data: {
        nodes: nodes,
        links: links
      }
    });
  }

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
        <h3>Dataset: {this.state.params.dataset}</h3>
        <h3>Graph: {this.state.params.graph}</h3>
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