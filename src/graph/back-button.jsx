import React from 'react';
import PropTypes from 'prop-types';

export default class BackButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {(this.props.mode == 'model-graph') && (
                    <button className="back-button" onClick={this.props.backFunction}>
                        <h5>&lt;  Back to Data Graph</h5>
                    </button>
                )}
            </div>
        );
    };
}

BackButton.propTypes = {
    backFunction: PropTypes.func,
    mode: PropTypes.string
};
