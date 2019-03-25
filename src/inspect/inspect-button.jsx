import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: 0,
      fairness: [],
      accountability: [],
      transparency: [],
      chartData: {}
    };

    this.downloadAllChartTypes = this.downloadAllChartTypes.bind(this);
    this.downloadChartSVG = this.downloadChartSVG.bind(this);
  }

  downloadAllChartTypes(mode) {
    fetch(`/chart/${ mode }/all`).then(r => {
      if (r.status !== 200) {
        console.error(`Error when attempting to fetch chart types for ${ mode }!`);
      }
      r.json().then(data => {
        console.log(data.data);
        this.setState({
          chartData: data
        });
      });
    }, e => console.error(e)); 
  }

  downloadChartSVG(mode, tab, chartType, dataset, args) {
    // TODO: args
    fetch(`/chart/${ mode }/${ tab }/${ chartType }/${ dataset }/svg`).then(r => {
      if (r.status !== 200) {
        console.error(`Error when attempting to download chart svg for ${ chartType }!`);
      }
      r.json().then(data => {
        console.log(data);
        this.setState({
          chartData: data
        });
      });
    }, e => console.error(e)); 
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) {

    }
  }

  componentDidMount() {
    
    // fetch chart - eventually move to other function
    /* fetch('http://127.0.0.1:5000/inspector/' + this.props.dataset + '/fairness/chart').then(r => {
      if (r.status !== 200) {
        console.error('Error when attempting to fetch functions!');
      }
      r.json().then(data => {
        console.log(data.data);
        try {
          let ahhh = window.atob(data.data);
          this.setState({
            chart: ahhh
          });
          /* this.setState({
            ...this.state,
            chart: atob(data.data)
          }); */
        /*} catch (error) {
          console.log(error);
        };
      });
    }, e => console.error(e)); */
    //downloadAllChartTypes(this.props.mode);
    console.log('mode popup');
    console.log(this.props.mode);

    fetch('/chart/' + this.props.mode + '/all').then(r => {
      if (r.status !== 200) {
        console.error('Error when attempting to fetch chart types for ' + this.props.mode + '!');
      }
      r.json().then(data => {
        console.log(data);

        this.setState({
          fairness: data.fairness,
          accountability: data.accountability,
          transparency: data.transparency
        });
      });
    }, e => console.error(e));
    
    this.downloadChartSVG(this.props.mode, 'fairness', 'histogram', this.props.dataset, []);
  }

  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <div className="popup_title">
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="home" title="Fairness" onSelect={ () => { this.setState({ activeTab: 'fairness' }) } }>
                <div dangerouslySetInnerHTML={{ __html: this.state.chart }}></div>
                { Object.keys(this.state.fairness).map((obj, i) => <div key={ i }>{ obj }</div>) }

                hello there:) this is tab1
              </Tab>
              <Tab eventKey="profile" title="Accountability">
                { Object.keys(this.state.accountability).map((obj, i) => <div key={ i }>{ obj }</div>) }

                tab2
              </Tab>
              <Tab eventKey="contact" title="Transparency">
                tab3
              </Tab>
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