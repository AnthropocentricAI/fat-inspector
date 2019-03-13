import React from "react";
import { Graph } from "react-d3-graph";
import defaultConfig from "./config";
import Popup from "../popup.jsx";
import PopupForm from "../popup_form.jsx";
import DisplayName from "./displayname.jsx";

export default class Tool extends React.Component {
  constructor(props) {
    super(props);

    const data = {
      nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
      links: [
        { source: "Harry", target: "Sally" },
        { source: "Harry", target: "Alice" }
      ]
    };

    const config = defaultConfig;
    const nodeClicked = false;

    this.state = {
      config,
      data,
      nodeClicked
    };
    this.onClickNode = this.onClickNode.bind(this);
  }

  componentWillMount() {
    // on load, ask the server for the list of node functions
    fetch("/graph/functions")
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log("Status code not 200: " + response.status);
            return;
          }

          response.json().then(
            function(data) {
              this.setState({
                ...this.state,
                ...data
              });
              console.log(`Received functions ${JSON.stringify(data)}...`);
              console.log(this.state);
            }.bind(this)
          );
        }.bind(this)
      )
      .catch(
        function(err) {
          console.log("Fetch error: ", err);
        }.bind(this)
      );
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
      id: "graph",
      data: this.state.data,
      config: this.state.config,
      onClickNode: this.onClickNode
    };

    return (
      <div>
        <DisplayName text={this.props.dataset} />
        <Graph ref="graph" {...graphProps} />

        {this.state.nodeClicked && (
          <Popup>
            <PopupForm />
          </Popup>
        )}
      </div>
    );
  }
}
