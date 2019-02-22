import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './popup.jsx'
import PopupForm from './popup_form.jsx'
import PopupYesNo from './popup.jsx';

//import './sass/main.scss'

const App = () => (
    <div>
        <h2>hahahaha</h2>
        {/* <Popup title="Title" desc="Description."></Popup>
        <PopupForm></PopupForm> */}
        <Popup title="title" desc="desc">
            <PopupForm></PopupForm>
        </Popup>
        {/* <PopupYesNo title="Title" form={ PopupForm }>
            <p>dsjaidjasio</p>
        </PopupYesNo> */}
    </div>
);

ReactDOM.render(<App/>, document.getElementById('root'));