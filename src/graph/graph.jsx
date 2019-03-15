import React from "react";
import ReactDOM from "react-dom";
import { Graph } from 'react-d3-graph';
import defaultConfig from './config'

import Popover from 'react-bootstrap/Popover'
import Nav from 'react-bootstrap/Nav'
import NodeModalEdit from './node_modal_edit.jsx'

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        const data = {
            nodes: [{ id: 'Harry', label: 'harrylabel' }, { id: 'Sally' }, { id: 'Alice' }],
            links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
        };

        // action called on onClick
        const nodeOptions = [
            {
                name: 'Inspect',
                icon: 'static/assets/inspect.svg',
                action: () => {}
            },
            {
                name: 'Convert to Model',
                icon: 'static/assets/right_arrow.svg',
                action: () => {}
            },
            {
                name: 'Edit',
                icon: 'static/assets/pencil.svg',
                action: () => {
                    this.setState({ 'edit': true });
                }
            },
            {
                name: 'Apply Function',
                icon: '',
                action: () => {}
            }
        ]

        const config = defaultConfig;
        const nodeClicked = false;

        this.state = {
            config,
            data,
            nodeClicked,
            nodeOptions,
            edit: false
        };

        this.onClickNode = this.onClickNode.bind(this);
        this.onClickGraph = this.onClickGraph.bind(this);
        this.renameNode = this.renameNode.bind(this);
    }

    componentWillMount() {
        // on load, ask the server for the list of node functions
        fetch('/graph/functions')
            .then(
                function(response) {
                if (response.statuconfigs !== 200) {
                        console.log('Status code not 200: ' + response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        this.setState({
                            ...this.state,
                            ...data,
                        });
                        console.log(`Received functions ${JSON.stringify(data)}...`);
                        console.log(this.state);
                    }.bind(this));
                }.bind(this)
            )
            .catch(function(err) {
                console.log('Fetch error: ', err);
            }.bind(this))
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
            nodeClicked: {
                id: id
            }
        });
    }

    onClickGraph() {
        // deselect popup if open
        if (this.state.nodeClicked) this.setState({ nodeClicked: null });
    }

    renameNode(nodeId, name) {
        this.setState({
            data: {
                nodes: this.state.data.nodes.map(x => x.id === nodeId ? {...x, label: name} : x),
                links: this.state.data.links
            }
        });
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
                document.getElementById(this.state.nodeClicked.id)
            );
        };

        return (
            <div>
                <h1>Dataset: { this.props.dataset }</h1>
                <Graph ref="graph" {...graphProps} />

                { this.state.nodeClicked &&
                    <NodeModalEdit show={ this.state.edit } onClose={() => this.setState({ edit: false }) } node={ this.state.nodeClicked } rename={ this.renameNode }></NodeModalEdit>
                }

                {/* display popup */}
                {/* TODO: add delete */}
                { this.state.nodeClicked &&
                <Portal>
                    <foreignObject x="30" y="-15" width="200" height="200">
                        <Popover className="node_popover" id="popover-basic" title={this.state.nodeClicked.id}>
                            <Nav className="flex-column">
                                {/* desc */}
                                <p>Example description</p>
                                {/* create options */}
                                {this.state.nodeOptions.map(opt => (
                                    <Nav.Item key={ opt.name } onClick={ opt.action }>
                                        <Nav.Link className="node_popover_nav_link">
                                        <img className="node_popover_nav_img" src={opt.icon} width="16px" height="16px" />
                                            { opt.name }
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