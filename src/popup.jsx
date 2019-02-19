import * as React from 'react';

export default class Popup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="popup_cont">
                <img className="popup_close" src="assets/gear.svg"></img>
                <h1 className="popup_title">Title</h1>
                <p>Words.</p>
            </div>
        );
    }
}