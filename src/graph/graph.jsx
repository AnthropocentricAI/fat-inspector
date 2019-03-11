import React from "react";
import ReactDOM from "react-dom";
import { Graph } from 'react-d3-graph';
import defaultConfig from './config'
import Popup from '../popup.jsx'
import PopupForm from '../popup_form.jsx'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Button from 'react-bootstrap/Button'

import Nav from 'react-bootstrap/Nav'

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        const data = {
            nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
            links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
        };

        const config = defaultConfig;
        const nodeClicked = false;

        this.state = {
            config,
            data,
            nodeClicked
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

    addPopup(id) {
        let nodeElement = document.getElementById(id);

        const toApp = (
            <div>
                words
            </div>
        )
        nodeElement.appendChild(
            toApp
        );
    }
    
    onClickNode(id) {
        // TODO: Render popup

        //this.addPopup(id);

        let newId = `${id}-${Math.floor(Math.random() * 20)}`;
        this.setState({
/*             data: {
                nodes: [...this.state.data.nodes, { id: newId }],
                links: [...this.state.data.links, { source: id, target: newId }]
            }, */
            nodeClicked: {
                id: id
            }
        });
    }

    onClickGraph() {
        if (this.state.nodeClicked) this.setState({ nodeClicked: null });
    }

    /* popover(x, y) {
        return (
            <Popover id="popover-basic" title="Popover right" style="transform: translate3d(300px, 300px, 0px);">
                And here's some <strong>amazing</strong> content. It's very engaging. right?
            </Popover>
        )
    }; */

    render() {
        const graphProps = {
            id: 'graph',
            data: this.state.data,
            config: this.state.config,
            onClickNode: this.onClickNode,
            onClickGraph: this.onClickGraph
        };

        let popover = (
            <Popover id="popover-basic" title="Popover right">
              And here's some <strong>amazing</strong> content. It's very engaging. right?
            </Popover>
        );

        let nodePos = this.state.nodeClicked ? document.getElementById(this.state.nodeClicked.id).getBoundingClientRect() : 0;
        console.log(nodePos);

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

                { this.state.nodeClicked &&
                    <Modal>
                        <foreignObject x="30" y="-15" width="200" height="200">
                            <Popover id="popover-basic" title={this.state.nodeClicked.id}>
                                <Nav class="flex-column">
                                    <Nav.Item>
                                        <Nav.Link className="wordswordswords">
                                            <img src="assets/inspect" width="16px" height="16px" />
                                            words
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link class="wordswordswords">
                                            <img src="assets/inspect" width="16px" height="16px" />
                                            words
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Popover>
                        </foreignObject>
                    </Modal>
                }

                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                    <Button variant="primary">Hover me</Button>
                </OverlayTrigger>
                {/* console.log(document.getElementById(id).getBoundingClientRect()); */}
                {/* style="transform: translate3d(0px, 5330px, 0px);" */}

            </div>
        );
    }
}

// inspect
// convert to model
// edit (rename/desc)