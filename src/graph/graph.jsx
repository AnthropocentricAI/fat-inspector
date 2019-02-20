import React from "react";
import { Graph } from 'react-d3-graph';
import defaultConfig from './config'

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        const data = {
            nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
            links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
        };

        const config = defaultConfig;

        this.state = {
            config,
            data
        }
        this.onClickNode = this.onClickNode.bind(this);
    }

    onClickNode(id) {
        // TODO: Render popup
        let newId = id + Math.floor(Math.random() * 20)
        this.setState({
            data: {
                nodes: [...this.state.data.nodes, { id: newId }],
                links: [...this.state.data.links, { source: id, target: newId }]
            }
        });
    }

    render() {
        const graphProps = {
            id: 'graph',
            data: this.state.data,
            config: this.state.config,
            onClickNode: this.onClickNode,
        }

        return (
            <div>
                <h1>Dataset: { this.props.dataset }</h1>
                <Graph ref="graph" {...graphProps} />
            </div>
        );
    }
}