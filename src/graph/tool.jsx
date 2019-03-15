import React from "react";
import ReactDOM from "react-dom";
import { Graph } from 'react-d3-graph';
import defaultConfig from './config'
import Popover from 'react-bootstrap/Popover'

import Nav from 'react-bootstrap/Nav'
import Popup from '../popup.jsx'
import PopupForm from '../popup_form.jsx'
import PropTypes from 'prop-types';

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

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
            nodeClicked,
            nodeOptions
        };

        this.onClickNode = this.onClickNode.bind(this);
        this.onClickGraph = this.onClickGraph.bind(this);
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
                <h3>Dataset: { this.props.dataset }</h3>
                <h3>Graph: { this.props.graph }</h3>
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

Tool.propTypes = {
    dataset: PropTypes.string.isRequired,
    graph: PropTypes.string.isRequired,
    isNew: PropTypes.bool.isRequired
};