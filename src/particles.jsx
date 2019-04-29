import React from 'react';
import PropTypes from 'prop-types';
import 'particles.js';

export default class Particles extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const bytes = new TextEncoder().encode(JSON.stringify(this.props.config));
    const blob = new Blob([bytes], {
      type: 'application/json;charset=utf-8',
    });
    particlesJS.load('particles-js', URL.createObjectURL(blob), () =>
      console.log('loaded')
    );
  }

  render() {
    return <div className={this.props.className} id="particles-js" />;
  }
}

Particles.propTypes = {
  config: PropTypes.object.isRequired,
};
