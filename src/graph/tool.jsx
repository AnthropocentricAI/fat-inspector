import React from "react";
import { Graph } from 'react-d3-graph';
import defaultConfig from './config'
import Popup from '../popup.jsx'
import PopupForm from '../popup_form.jsx'
import PropTypes from 'prop-types';

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        const config = defaultConfig;
        const nodeClicked = false;

        this.state = {
            config,
            nodeClicked
        };
        this.onClickNode = this.onClickNode.bind(this);
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
                    nodes: [{id: 'root'}],
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
        // TODO: Render popup
        let newId = `${id}-${Math.floor(Math.random() * 20)}`;
        this.setState({
            data: {
                nodes: [...this.state.data.nodes, { id: newId }],
                links: [...this.state.data.links, { source: id, target: newId }]
            },
            nodeClicked: {
                id: newId
            }
        });
    }

    render() {
        const graphProps = {
            id: 'graph',
            data: this.state.data,
            config: this.state.config,
            onClickNode: this.onClickNode,
        };

        return (
            <div>
                <h3>Dataset: { this.props.dataset }</h3>
                <h3>Graph: { this.props.graph }</h3>
                <Graph ref="graph" {...graphProps} />

                { this.state.nodeClicked &&
                    <Popup>
                        <PopupForm></PopupForm>
                    </Popup>
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