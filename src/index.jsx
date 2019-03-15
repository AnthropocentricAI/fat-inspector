import React from "react";
import ReactDOM from "react-dom";
import FileChooser from './forms/file-chooser.jsx';

// const App = () => (
//     <div>
//         <p>Words</p>
//         <Topbar />
//         <Tool dataset='iris'/>
//     </div>
// );

class App extends React.Component {
    render() {
        return (
            <div>
                <FileChooser/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
