import React from "react";
import ReactDOM from "react-dom";
import {Graph} from 'react-d3-graph';
import defaultConfig from './config';
import Popover from 'react-bootstrap/Popover';

import Nav from 'react-bootstrap/Nav';
import PropTypes from 'prop-types';
import NodeModalEdit from './node-modal-edit.jsx'

import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDiceD6, faEdit, faSearch, faSuperscript} from '@fortawesome/free-solid-svg-icons';
import NodeModalApply from './node-modal-apply.jsx';

library.add(faSearch);
library.add(faDiceD6);
library.add(faEdit);
library.add(faSuperscript);

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        // action called on onClick
        const nodeOptions = [
            {
                name: 'Inspect',
                icon: 'search',
                action: () => {
                }
            },
            {
                name: 'Convert to Model',
                icon: 'dice-d6',
                action: {}
            },
            {
                name: 'Edit',
                icon: 'edit',
                action: () => {
                    this.setState({edit: true});
                }
            },
            {
                name: 'Apply Function',
                icon: 'superscript',
                action: () => {
                    this.setState({showApply: true})
                }
            }
        ];

        const config = defaultConfig;
        const nodeClickedId = false;

        this.state = {
            config,
            nodeClickedId,
            nodeOptions,
            functions: [],
            edit: false,
            showApply: false
        };

        this.onClickNode = this.onClickNode.bind(this);
        this.onClickGraph = this.onClickGraph.bind(this);
        this.renameNode = this.renameNode.bind(this);
        this.redescNode = this.redescNode.bind(this);
        this.getNodeData = this.getNodeData.bind(this);
        this.getNameOfNode = this.getNameOfNode.bind(this);
    }

    fetchFunctions() {
        // on load, ask the server for a the list of node functions
        fetch('/graph/functions').then(r => {
            if (r.status !== 200) {
                console.error('Error when attempting to fetch functions!');
            }
            r.json().then(data => {
                this.setState({
                    ...this.state,
                    functions: data
                });
                console.log(data);
            });
        }, e => console.error(e));
    }

    populateGraph() {
        if (this.props.isNew) {
            this.setState({
                ...this.state,
                data: {
                    nodes: [{id: 'root-node'}],
                    links: []
                }
            })
        } else {
            // TODO: fetch graph
        }
    }

    componentWillMount() {
        this.fetchFunctions();
        this.populateGraph();
    }

    onClickNode(id) {
        let newId = `${id}-${Math.floor(Math.random() * 20)}`;
        this.setState({
            // create new random node
            /* data: {
                nodes: [...this.state.data.nodes, { id: newId }],
                links: [...this.state.data.links, { source: id, target: newId }]
            }, */
            // open popup
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

    renameNode(nodeId, name) {
        this.setState({
            data: {
                nodes: this.state.data.nodes.map(x => x.id === nodeId ? {...x, label: name} : x),
                links: this.state.data.links
            }
        });
    }

    redescNode(nodeId, desc) {
        this.setState({
            data: {
                nodes: this.state.data.nodes.map(x => x.id === nodeId ? {...x, desc: desc} : x),
                links: this.state.data.links
            }
        });
    }

    // gets data in payload for a given node
    // gross but the only way :(
    getNodeData(nodeId) {
        for (let x of this.state.data.nodes) if (x.id == nodeId) return x;
        return null;
    }

    getNameOfNode(node) {
        return 'label' in node ? node.label : node.id;
    }

    createChild(parent, child, desc, func) {
        this.setState((prev, props) => {
            return {
                showApply: false,
                data: {
                    nodes: [...prev.data.nodes, {id: child, desc: desc, func: func}],
                    links: [...prev.data.links, {source: parent, target: child}]
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

        // portal from children of node element
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

                {
                    node &&
                    <NodeModalEdit show={this.state.edit}
                                   onClose={() => this.setState({edit: false})}
                                   node={node}
                                   rename={this.renameNode} redesc={this.redescNode}/>
                }

                {
                    node &&
                    <NodeModalApply show={this.state.showApply}
                                    functions={this.state.functions}
                                    parent={this.state.nodeClickedId}
                                    onHide={() => this.setState({showApply: false})}
                                    onApply={this.createChild.bind(this)}/>
                }

                {/* display popup */}
                {/* TODO: add delete */}
                {
                    node &&
                    <Portal>
                        <foreignObject x="30" y="-15" width="200px" height="100%">
                            <Popover className="node_popover" id="popover-basic" title={this.getNameOfNode(node)}>
                                <Nav className="flex-column">
                                    {/* desc */}
                                    {
                                        node.func &&
                                        <p>Function: {node.func}</p>
                                    }
                                    {
                                        node.desc &&
                                        <p>Description: {node.desc}</p>
                                    }

                                    {/* create options */}
                                    {this.state.nodeOptions.map(opt => (
                                        <Nav.Item key={opt.name} onClick={opt.action}>
                                            <FontAwesomeIcon fixedWidth icon={opt.icon}/>
                                            <Nav.Link className="node_popover_nav_link">
                                                {opt.name}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </Popover>
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