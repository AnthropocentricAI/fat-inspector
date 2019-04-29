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

class App extends React.Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route
              exact
              path={`/tool/:dataset/:graph/:model?/:prediction?`}
              render={props => (
                <>
                  <Tool {...props} />
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
