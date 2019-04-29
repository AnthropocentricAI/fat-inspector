import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faArrowLeft);

export default class BackButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {(this.props.mode == 'model') && (
                    <button className="back-button" onClick={this.props.backFunctionData}>
                        <FontAwesomeIcon icon="arrow-left" size="3x" />
                        {/* <h5 className='backword'>Back to Data Graph</h5> */}
                    </button>
                )}
                {(this.props.mode == 'prediction') && (
                    <button className="back-button" onClick={this.props.backFunctionModel}>
                        <FontAwesomeIcon icon="arrow-left" size="3x" />
                        {/* <h5 className='backword'>Back to Data Graph</h5> */}
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
