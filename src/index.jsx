import React from "react";
import ReactDOM from "react-dom";
import FileChooser from './forms/file-chooser.jsx';
import Tool from './graph/graph.jsx';
import Topbar from './topbar/Topbar.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openGraph: false
        };
    }

    updateSelected(dataset, graph) {
        this.setState({
            ...this.state,
            dataset: dataset,
            graph: graph,
            openGraph: true
        });
    }

    render() {
        return (
            <div>
                {
                    this.state.openGraph ?
                    <div>
                        <Topbar />
                        <Tool dataset={this.state.dataset}
                              graph={this.state.graph}/>
                    </div> : <FileChooser onOpenGraph={this.updateSelected.bind(this)}/>
                }
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
