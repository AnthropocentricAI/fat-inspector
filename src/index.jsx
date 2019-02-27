<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './popup.jsx'
import PopupForm from './popup_form.jsx'
import PopupYesNo from './popup.jsx';

//import './sass/main.scss'

const App = () => (
    <div>
        <h2>hahahaha</h2>
        <Popup title="title" desc="desc">
            <PopupForm></PopupForm>
        </Popup>
    </div>
);

ReactDOM.render(<App/>, document.getElementById('root'));
=======
import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Tool from './graph/graph.jsx'
 
const App = () => (
  <div>
    <p>Words</p>
    <Topbar />
    <Tool dataset='iris'/>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
>>>>>>> 0648753d12a3ba6ab14ab76d7ed50c32dd59f16b
