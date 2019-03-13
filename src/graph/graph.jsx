import React from "react";
import ReactDOM from "react-dom";
import { Graph } from 'react-d3-graph';
import defaultConfig from './config'
import Popover from 'react-bootstrap/Popover'

import Nav from 'react-bootstrap/Nav'

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        const data = {
            nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
            links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
        };

        // action called on onClick
        // TODO: pass this into comp.?
        const nodeOptions = [
            {
                name: 'Inspect',
                icon: 'static/assets/inspect.svg',
                action: {}
            },
            {
                name: 'Convert to Model',
                icon: 'static/assets/right_arrow.svg',
                action: {}
            },
            {
                name: 'Edit',
                icon: 'static/assets/pencil.svg',
                action: {}
            }
        ]

        const config = defaultConfig;
        const nodeClicked = false;

        this.state = {
            config,
            data,
            nodeClicked,
            nodeOptions
        };

        this.onClickNode = this.onClickNode.bind(this);
        this.onClickGraph = this.onClickGraph.bind(this);
    }

    componentWillMount() {
        // on load, ask the server for the list of node functions
        fetch('/graph/functions')
            .then(
                function(response) {
                    if (response.status !== 200) {
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
            /*data: {
                nodes: [...this.state.data.nodes, { id: newId }],
                links: [...this.state.data.links, { source: id, target: newId }]
            },*/
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

    render() {
        const graphProps = {
            id: 'graph',
            data: this.state.data,
            config: this.state.config,
            onClickNode: this.onClickNode,
            onClickGraph: this.onClickGraph
        };

        // portal from children of node element
        const Modal = ({children}) => {
            return ReactDOM.createPortal(
                children,
                document.getElementById(this.state.nodeClicked.id)
            );
        };

        return (
            <div>
                <h1>Dataset: { this.props.dataset }</h1>
                <Graph ref="graph" {...graphProps} />

                {/* display popup */}
                { this.state.nodeClicked &&
                    <Modal>
                        <foreignObject x="30" y="-15" width="200" height="200">
                            <Popover className="node_popover" id="popover-basic" title={this.state.nodeClicked.id}>
                                <Nav className="flex-column">
                                    {/* create options */}
                                    {this.state.nodeOptions.map(opt => (
                                        <Nav.Item>
                                            <Nav.Link className="node_popover_nav_link">
                                            <img className="node_popover_nav_img" src={opt.icon} width="16px" height="16px"/>
                                                { opt.name }
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </Popover>
                        </foreignObject>
                    </Modal>
                }
            </div>
        );
    }
}