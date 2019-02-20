import React from "react";
import { Graph } from 'react-d3-graph';
 
// cheers https://github.com/danielcaldas/react-d3-graph/blob/master/sandbox/Sandbox.jsx
export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        const data = {
            nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
            links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
        };

        const config = {
            nodeHighlightBehavior: true,
            node: {
                color: 'lightgreen',
                size: 120,
                highlightStrokeColor: 'blue'
            },
            link: {
                highlightColor: 'lightblue'
            }
        };

        this.state = {
            config,
            data
        }
    }

    render() {
        const graphProps = {
            id: 'graph',
            data: this.state.data,
            config: this.state.config
        }

        return (
            <div>
                <Graph ref="graph" {...graphProps} />
            </div>
        );
    }
}