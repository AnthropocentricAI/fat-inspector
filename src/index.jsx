import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Tool from './graph/graph.jsx';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FileFacade from './fileFacade.jsx';
import Button from 'react-bootstrap/Button';

// const App = () => (
//     <div>
//         <p>Words</p>
//         <Topbar />
//         <Tool dataset='iris'/>
//     </div>
// );

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {datasets: []}
    }

    openUploadModal() {
        alert('TODO');
    }

    openGraph() {
        alert('TODO');
    }

    componentWillMount() {
        // on load, ask the server for a list of datasets
        fetch('/dataset/view')
            .then(
                function success(response) {
                    if (response.status !== 200) {
                        console.error('Failed to get a list of datasets from the server!\n');
                        return;
                    }

                    response.json().then(function (data) {
                        this.setState({
                            ...this.state,
                            datasets: data,
                        });
                        console.log(this.state);
                    }.bind(this))
                }.bind(this),

                function failure(err) {
                    console.error(err);
                }.bind(this)
            )
    }

    render() {
        return (
            <div className='form-main'>
                <Form>
                    <div className="form-label-wrapper">
                        <Form.Label>Dataset</Form.Label>
                    </div>
                    <Row>
                        <Form.Control as='select' placeholder='Dataset Name...'>
                            <option disabled selected hidden>Select a dataset...</option>
                            {
                                this.state.datasets.map(d => (
                                    <option key={d}>{d}</option>
                                ))
                            }
                        </Form.Control>
                    </Row>
                    <div className="form-label-wrapper">
                        <Form.Label>Graph</Form.Label>
                    </div>
                    <Row>
                        <Form.Control as='select' placeholder='Dataset Name...'>
                            <option disabled selected hidden>Select a graph...</option>
                            {
                                this.state.datasets.map(d => (
                                    <option key={d}>{d}</option>
                                ))
                            }
                        </Form.Control>
                    </Row>
                    <Row>
                        <div className="form-wrapper-centre">
                            <Button onClick={this.openGraph.bind(this)} variant='primary'>
                                Open Graph
                            </Button>
                            <Button onClick={this.openUploadModal.bind(this)} variant='link'>
                        Upload Custom Dataset
                    </Button>
                        </div>
                    </Row>
                </Form>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
