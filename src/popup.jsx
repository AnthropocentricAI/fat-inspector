import * as React from 'react';

export default class Popup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Popup_cont">
                <h1>Title</h1>
                <p>Words.</p>
            </div>
        );
    }
}