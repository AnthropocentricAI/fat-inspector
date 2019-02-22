import * as React from 'react';
import PopupForm from './popup_form.jsx';

export default class Popup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="popup_cont">
                <div>
                    <img className="popup_close" src="assets/gear.svg"></img>
                    <h2 className="popup_title">{ this.props.title }</h2>
                </div>
                <p className="popup_desc">{ this.props.desc }</p>
                { this.props.children }
            </div>
        );
    }
};

export function PopupYesNo(props) {
    return <Popup title="test" desc="dsadoajdoias">
        <p>aagjagj</p>
    </Popup>;
};