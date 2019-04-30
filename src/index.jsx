import React from 'react';
import ReactDOM from 'react-dom';
import FileChooser from './forms/file-chooser.jsx';
import loadable from '@loadable/component';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import ParticlesConfig from './particles-config.js';
import Particles from './particles.jsx';

import constants, { MODES } from './constants';

const Tool = loadable(() => import('./graph/tool.jsx'));

function getMode({ dataGraph, modelGraph, predictionGraph }) {
  console.log({ dataGraph, modelGraph, predictionGraph });
  if (predictionGraph)
    return { mode: 'prediction', currentGraph: predictionGraph };
  if (modelGraph) return { mode: 'model', currentGraph: modelGraph };
  if (dataGraph) return { mode: 'data', currentGraph: dataGraph };
}

class App extends React.Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route
              exact
              path={`/tool/:dataset/:dataGraph/:modelGraph?/:predictionGraph?`}
              render={props => (
                <>
                  <Tool
                    key={`tool-mode-${getMode(props.match.params).mode}`}
                    {...getMode(props.match.params)}
                    {...props}
                  />
                </>
              )}
            />
            <Route
              exact
              path="/"
              render={props => (
                <>
                  <Particles className="particles" config={ParticlesConfig} />
                  <FileChooser {...props} />
                </>
              )}
            />
            <Route render={props => <Redirect {...props} to="/" />} />
          </Switch>
        </Router>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
