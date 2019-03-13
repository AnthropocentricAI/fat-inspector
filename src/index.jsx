import React from "react";
import ReactDOM from "react-dom";
import Topbar from "./topbar/Topbar.jsx";
import Tool from './graph/graph.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
            <div className='datasetForm'>
                <Form>
                    <h4 className='datasetFormHeader'>Choose from an existing dataset...</h4>
                    <Row>
                        <Col md={12}>
                            <Form.Control as='select' placeholder='Dataset Name...'>
                                <option disabled selected hidden>Select a dataset...</option>
                                {
                                    this.state.datasets.map(d => (
                                        <option key={d}>{d}</option>
                                    ))
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    { /* upload file */}
                    <h4 className='datasetFormHeader'>or, upload your own!</h4>
                    <Row>
                        <Col md={10}>
                            <Form.Control placeholder='name'/>
                        </Col>
                        <Col md={2}>
                            <div className='fileButtonWrapper'>
                                <Form.Label className='uploadLabel'>
                                    <Form.Control type='file'/>
                                    <span className='fakeFileButton'>Browse</span>
                                </Form.Label>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
