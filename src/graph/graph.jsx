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
        };
        this.onClickNode = this.onClickNode.bind(this);
    }

    componentWillMount() {
        // on load, ask the server for the list of node functions
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/graph/functions', true);
        xhr.onload = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let funcs = JSON.parse(xhr.response);
                    this.setState({
                        ...this.state,
                        ...funcs,
                    });
                    console.log(`Received functions ${JSON.stringify(funcs)}...`);
                    console.log(this.state)
                } else {
                    console.error(xhr.statusText);
                    // TODO: err popup
                }
            }
        }.bind(this);
        xhr.send();
    }

    onClickNode(id) {
        // TODO: Render popup
        let newId = id + Math.floor(Math.random() * 20);
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
        };

        return (
            <div>
                <h1>Dataset: { this.props.dataset }</h1>
                <Graph ref="graph" {...graphProps} />
            </div>
        );
    }
}