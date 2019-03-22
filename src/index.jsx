import React from "react";
import ReactDOM from "react-dom";
import FileChooser from './forms/file-chooser.jsx';
import InspectButton from './inspect/inspect-button.jsx';
import Topbar from './topbar/topbar.jsx'
import loadable from '@loadable/component';

const Tool = loadable(() => import('./graph/tool.jsx'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openGraph: false
    };
  }

  updateSelected(dataset, graph, isNew) {
    this.setState({
      ...this.state,
      dataset: dataset,
      graph: graph,
      isNew: isNew,
      openGraph: dataset && graph
    });
  }

  render() {
    return (
      <div>
        {
          this.state.openGraph ?
            <div>
              <Topbar/>
              <Tool dataset={this.state.dataset}
                    graph={this.state.graph}
                    isNew={this.state.isNew}/>
              <InspectButton dataset={this.state.dataset} />
            </div> : <FileChooser onOpenGraph={this.updateSelected.bind(this)}/>
        }
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"));
