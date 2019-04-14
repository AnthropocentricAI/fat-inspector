import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
const queryString = require('query-string')

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: {
        fairness: { id: 'fairness', title: 'Fairness' },
        accountability: { id: 'accountability', title: 'Accountability' },
        transparency: { id: 'transparency', title: 'Transparency' }
      },
      chartData: {},
      svgData: {}
    };

    this.downloadAllChartTypes = this.downloadAllChartTypes.bind(this);
    this.downloadChartSVG = this.downloadChartSVG.bind(this);
    this.submitArgs = this.submitArgs.bind(this);
  }

  downloadAllChartTypes = (mode) => {
    return fetch(`/chart/${ mode }/all`).then(r => {
      if (r.status !== 200) {
        console.error(`Error when attempting to fetch chart types for ${ mode }!`);
      }
      return r.json().then(data => {
        console.log(data);
        this.setState(prev => ({
          ...prev,
          chartData: data
        }));
        return data;
      });
    }, e => console.error(e)); 
  }

  // where args :: String
  downloadChartSVG(mode, tab, chartType, dataset, args) {
    // TODO: args
    return fetch(`/chart/${ mode }/${ tab }/${ chartType }/${ dataset }/svg?${ args }`).then(r => {
      if (r.status !== 200) {
        console.error(`Error when attempting to download chart svg for ${ chartType }!`);
      }
      r.json().then(data => {
        console.log(data);
        this.setState(prev => ({
          ...prev,
          svgData: {
            ...prev.svgData,
            [data.chart_type]: {
              chartType: data.chart_type,
              svg: atob(data.svg),
              args: data.args
            }
          }
        }));
        return data;
      });
    }, e => console.error(e)).then(response => response.json()); 
  }

  componentDidMount() {
    this.downloadAllChartTypes(this.props.mode).then((data) => {
      for (const [key, value] of Object.entries(this.state.tabs)) {
        // download all chart SVGs
        if (value.id in data) {
          for (const [key2, value2] of Object.entries(data[value.id])) {
            console.log(value2.id);
            // default arguments string
            let def = value2.args.reduce((obj, k, i) => ({...obj, [k]: value2.args_default[i] }), {});
            let defString = queryString.stringify(def);

            //let defArgs = [];
            //value2.args.forEach((key, i) => defArgs[i].)
            //let def = value2.args.map(function f)

            this.downloadChartSVG(this.props.mode, value.id, value2.id, this.props.dataset, defString);
          }
        }
      }
    });

    /* this.downloadAllChartTypes(this.props.mode);
    //keys.reduce((obj, k, i) => ({...obj, [k]: values[i] }), {})
    this.downloadChartSVG(this.props.mode, 'fairness', 'histogram', this.props.dataset, []);
    this.downloadChartSVG(this.props.mode, 'accountability', 'class_count', this.props.dataset, []); */
  }

  submitArgs(tab, chart, e) {
    e.preventDefault();
    let data = new FormData(e.target);
    if (data.get('col') !== '')
      console.log(data.get('col'));
    
    //console.log(data);
    //data.entries().forEach((e) => { console.log(e) });
    // entries => argString
    console.log(data);
    let argString = ''
    for(var pair of data.entries()) {
      argString += `${ pair[0] }=${ pair[1] }`;
      //console.log(pair[0]+ ', '+ pair[1]); 
    }

    console.log(argString);

    // redownload
    this.downloadChartSVG(this.props.mode, tab, chart, this.props.dataset, argString);
  }

  render() {
    const tabs = ['fairness', 'accountability', 'transparency'];

    return (
      <div className='popup'>
        <div className='popup_inner'>
          <div className="popup_title">
            <Tabs defaultActiveKey="fairness" id="uncontrolled-tab-example">
              { tabs.map(item => (

                <Tab eventKey={ item } title={ item }>
                  { this.state.chartData[item] &&                  
                    Object.keys(this.state.chartData[item]).map((obj, i) =>
                      <div key={ i }>
                        <h4>{ this.state.chartData[item][obj].title }:</h4>
                        { this.state.svgData[obj] ? (
                          < >
                            <div className="chart__cont" dangerouslySetInnerHTML={{ __html: this.state.svgData[obj].svg }}></div>

                            { this.state.chartData[item][obj].args.length && (
                              < >
                                <h5>Arguments:</h5>
                                <Form onSubmit={(e) => this.submitArgs(item, this.state.chartData[item][obj].id, e)}>
                                  { this.state.chartData[item][obj].args.map((arg, arg_i) =>
                                    < >
                                      <Form.Group controlId="">
                                      <InputGroup className={ arg }>
                                        <InputGroup.Prepend>
                                          <InputGroup.Text id={ `txt_${arg}` }>{ arg }</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control name={ arg }
                                                      placeholder={ this.state.chartData[item][obj].args_default[arg_i] }
                                        />
                                      </InputGroup>
                                      </Form.Group>
                                    </>
                                  ) }
                                  <Button variant="primary" type="submit">
                                    Apply Arguments
                                  </Button>
                                </Form>
                              </>
                              )
                            }

                          </>
                        ) : (
                          <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                          </Spinner>
                        )}
                      </div>
                    )
                  }
                </Tab>

              )) }
            </Tabs>
            <button class="popup_close" onClick={this.props.closePopup}>X</button>
          </div>
        </div>
      </div>
    );
  }
}

class InspectButton extends React.Component {
  constructor() {
    super();
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    return (
      <div className="inspBtn_wrap">
        <button className="insp_button" onClick={this.toggle.bind(this)}>Inspect</button>
        {this.state.popoverOpen ?
          <Popup
            closePopup={this.toggle.bind(this)}
            dataset={this.props.dataset}
            mode={ this.props.mode }
          />
          : null
        }
      </div>
    );
  }
}

export default InspectButton;