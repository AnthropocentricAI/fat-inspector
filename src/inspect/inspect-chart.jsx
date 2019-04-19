import React from "react";
import PropTypes from 'prop-types';

import Spinner from 'react-bootstrap/Spinner'
import ChartArgs from './inspect-chart-args.jsx'

const queryString = require('query-string')

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { svgData: {} }
  }

  // where args :: String
  downloadChartSvg = (mode, tab, chartType, dataset, args) => {
    return fetch(`/chart/${ mode }/${ tab }/${ chartType }/${ dataset }/svg?${ args }`).then(r => {
      if (r.status !== 200)
        console.error(`Error when attempting to download chart svg for ${ chartType }!`);
      r.json().then(data => {
        this.setState(prev => ({
          svgData: {
            chartType: data.chart_type,
            svg: atob(data.svg),
            args: data.args
          }
        }));
        return data;
      });
    }, e => console.error(e)); 
  }

  componentDidMount() {
    // download chart with default args
    this.downloadChartSvg(this.props.mode, this.props.tab, this.props.chartData.id, this.props.dataset, []);
  }

  render() {
    return (
      <>
        <h4>{ this.props.chartData.title }:</h4>

        { this.state.svgData ? (
          <>
            <div className="chart__cont"
                 dangerouslySetInnerHTML={{ __html: this.state.svgData.svg }}>
            </div>

            { (this.props.chartData.args.length != 0) && (
                <ChartArgs args={ this.props.chartData.args }
                           argsDefault={ this.props.chartData.args_default }
                           redownload={ (args) => { this.downloadChartSvg(this.props.mode, this.props.tab, this.props.chartData.id, this.props.dataset, args) } }>
                </ChartArgs>
              )
            }
          </>
        ) : (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )
        }
      </>
    )
  }
}

Chart.propTypes = {
    mode: PropTypes.string,
    dataset: PropTypes.string,
    tab: PropTypes.string,
    chartData: PropTypes.object,
};

export default Chart;