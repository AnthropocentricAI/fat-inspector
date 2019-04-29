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
  constructor(props) {
    super(props);
    this.state = {
      isNew: false,
      openGraph: false,
    };
  }

  onSelect(dataset, graph, isNew) {
    this.setState({
      isNew: isNew,
    });
  }

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
                  <Tool {...props} isNew={this.state.isNew} />
                </>
              )}
            />
            <Route
              exact
              path="/"
              render={props => (
                <>
                  <Particles className="particles" config={ParticlesConfig} />
                  <FileChooser {...props} onSubmit={this.onSelect.bind(this)} />
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
