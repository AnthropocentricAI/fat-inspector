import React from 'react';
import ReactDOM from "react-dom";
import FileChooser from './forms/file-chooser.jsx';
import InspectButton from './inspect/inspect-button.jsx';
import Topbar from './topbar/topbar.jsx'
import loadable from '@loadable/component';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import ParticlesConfig from './particles-config.js';
import Particles from 'react-particles-js';

const Tool = loadable(() => import('./graph/tool.jsx'));

class App extends React.Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route exact path={`/tool/:dataset/:graph`} render={(props) => (
              <>
                <Topbar/>
                <Tool {...props}/>
                <InspectButton/>
              </>
            )}/>
            <Route exact path="/" render={(props) =>
              <>
                <Particles className="particles"
                           params={ParticlesConfig}/>
                <FileChooser {...props}/>
              </>
            }/>
            <Route render={(props) => <Redirect {...props} to="/"/>}/>
          </Switch>
        </Router>
      </>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("root"));
