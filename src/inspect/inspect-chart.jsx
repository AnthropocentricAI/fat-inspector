import React from 'react';
import PropTypes from 'prop-types';

import Spinner from 'react-bootstrap/Spinner';
import ChartArgs from './inspect-chart-args.jsx';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { svgData: null };
  }

  // where args :: String
  downloadChartSvg = (
    mode,
    tab,
    chartType,
    dataset,
    graph,
    graph_model,
    node,
    args
  ) => {
    return fetch(
      `/chart/${mode}/${tab}/${chartType}/${dataset}/${graph}/${graph_model}/${node}/svg?${args}`
    ).then(
      r => {
        if (r.status !== 200) {
          console.error(
            `Error when attempting to download chart svg for ${chartType}!`
          );
          this.setState({
            svgData: {
              text: 'ERROR: Could not download!',
            },
          });
        }
        r.json().then(data => {
          let decodedSvg = data.svg === 'None' ? null : atob(data.svg);

          this.setState(prev => ({
            svgData: {
              chartType: data.chart_type,
              svg: decodedSvg,
              text: data.text,
              args: data.args,
            },
          }));
          return data;
        });
      },
      e => console.error(e)
    );
  };

  componentDidMount() {
    // download chart with default args
    this.downloadChartSvg(
      this.props.mode,
      this.props.tab,
      this.props.chartData.id,
      this.props.dataset,
      this.props.graph,
      this.props.model,
      this.props.node,
      []
    );
  }

  render() {
    //console.log(this.props.model)
    return (
      <div className="chart__cont">
        <h4 className="chart__title">{this.props.chartData.title}</h4>

        {this.state.svgData ? (
          <>
            {this.state.svgData.text === 'ERROR' ? (
              <>error!!</>
            ) : (
              <>
                {this.state.svgData.svg && (
                  <div
                    className="chart__svg"
                    dangerouslySetInnerHTML={{ __html: this.state.svgData.svg }}
                  />
                )}

                {this.state.svgData.text && (
                  <div className="chart__text">{this.state.svgData.text}</div>
                )}

                {this.props.chartData.args.length != 0 && (
                  <ChartArgs
                    args={this.props.chartData.args}
                    argsDefault={this.props.chartData.args_default}
                    redownload={args => {
                      this.downloadChartSvg(
                        this.props.mode,
                        this.props.tab,
                        this.props.chartData.id,
                        this.props.dataset,
                        this.props.graph,
                        this.props.model,
                        this.props.node,
                        args
                      );
                    }}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </>
        )}
      </div>
    );
  }
}

Chart.propTypes = {
  mode: PropTypes.string,
  dataset: PropTypes.string,
  tab: PropTypes.string,
  chartData: PropTypes.object,
  graph: PropTypes.string,
  node: PropTypes.string,
  model: PropTypes.string,
};

export default Chart;
/*
⠀⠀⠀⣀⣶⣀
⠀⠀⠀⠒⣛⣭
⠀⠀⠀⣀⠿⣿⣶
⠀⣤⣿⠤⣭⣿⣿
⣤⣿⣿⣿⠛⣿⣿⠀⣀
⠀⣀⠤⣿⣿⣶⣤⣒⣛
⠉⠀⣀⣿⣿⣿⣿⣭⠉
⠀⠀⣭⣿⣿⠿⠿⣿
⠀⣶⣿⣿⠛⠀⣿⣿
⣤⣿⣿⠉⠤⣿⣿⠿
⣿⣿⠛⠀⠿⣿⣿
⣿⣿⣤⠀⣿⣿⠿
⠀⣿⣿⣶⠀⣿⣿⣶
⠀⠀⠛⣿⠀⠿⣿⣿
⠀⠀⠀⣉⣿⠀⣿⣿
⠀⠶⣶⠿⠛⠀⠉⣿
⠀⠀⠀⠀⠀⠀⣀⣿
⠀⠀⠀⠀⠀⣶⣿⠿

⠀⠀⠀⠀⠀⠀⠀⠀⣤⣿⣿⠶⠀⠀⣀⣀
⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣶⣿⣿⣿⣿⣿⣿
⠀⠀⣀⣶⣤⣤⠿⠶⠿⠿⠿⣿⣿⣿⣉⣿⣿
⠿⣉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⣤⣿⣿⣿⣀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣿⣿⣿⣿⣶⣤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣿⣿⣿⣿⠿⣛⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠛⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⣿⣿⠿⠀⣿⣿⣿⠛
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠀⠀⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿⣿⠀⠀⣿⣶
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠛⠀⠀⣿⣿⣶
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣿⣿⠤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⣿

⠀⠀⣀
⠀⠿⣿⣿⣀
⠀⠉⣿⣿⣀
⠀⠀⠛⣿⣭⣀⣀⣤
⠀⠀⣿⣿⣿⣿⣿⠛⠿⣶⣀
⠀⣿⣿⣿⣿⣿⣿⠀⠀⠀⣉⣶
⠀⠀⠉⣿⣿⣿⣿⣀⠀⠀⣿⠉
⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿
⠀⣀⣿⣿⣿⣿⣿⣿⣿⣿⠿
⠀⣿⣿⣿⠿⠉⣿⣿⣿⣿
⠀⣿⣿⠿⠀⠀⣿⣿⣿⣿
⣶⣿⣿⠀⠀⠀⠀⣿⣿⣿
⠛⣿⣿⣀⠀⠀⠀⣿⣿⣿⣿⣶⣀
⠀⣿⣿⠉⠀⠀⠀⠉⠉⠉⠛⠛⠿⣿⣶
⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣿
⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉
⣀⣶⣿⠛

⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣿⣿⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⣿⣿⣿⣶⣿⣿⣿⣶⣶⣤⣶⣶⠶⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣤⣿⠿⣿⣿⣿⣿⣿⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠛⣿⣤⣤⣀⣤⠿⠉⠀⠉⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠉⠉⠉⠉⠉⠀⠀⠀⠀⠉⣿⣿⣿⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣛⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣶⣿⣿⠛⠿⣿⣿⣿⣶⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⠛⠉⠀⠀⠀⠛⠿⣿⣿⣶⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⣀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⣶⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠛⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣿⣿⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

⠀⠀⠀⠀⠀⠀⣤⣶⣶
⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣀⣀
⠀⠀⠀⠀⠀⣀⣶⣿⣿⣿⣿⣿⣿
⣤⣶⣀⠿⠶⣿⣿⣿⠿⣿⣿⣿⣿
⠉⠿⣿⣿⠿⠛⠉⠀⣿⣿⣿⣿⣿
⠀⠀⠉⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣤⣤
⠀⠀⠀⠀⠀⠀⠀⣤⣶⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⣀⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿
⠀⠀⠀⠀⣀⣿⣿⣿⠿⠉⠀⠀⣿⣿⣿⣿
⠀⠀⠀⠀⣿⣿⠿⠉⠀⠀⠀⠀⠿⣿⣿⠛
⠀⠀⠀⠀⠛⣿⣿⣀⠀⠀⠀⠀⠀⣿⣿⣀
⠀⠀⠀⠀⠀⣿⣿⣿⠀⠀⠀⠀⠀⠿⣿⣿
⠀⠀⠀⠀⠀⠉⣿⣿⠀⠀⠀⠀⠀⠀⠉⣿
⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⣀⣿
⠀⠀⠀⠀⠀⠀⣀⣿⣿
⠀⠀⠀⠀⠤⣿⠿⠿⠿

⠀⠀⠀⠀⣀
⠀⠀⣶⣿⠿⠀⠀⠀⣀⠀⣤⣤
⠀⣶⣿⠀⠀⠀⠀⣿⣿⣿⠛⠛⠿⣤⣀
⣶⣿⣤⣤⣤⣤⣤⣿⣿⣿⣀⣤⣶⣭⣿⣶⣀
⠉⠉⠉⠛⠛⠿⣿⣿⣿⣿⣿⣿⣿⠛⠛⠿⠿
⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⠿
⠀⠀⠀⠀⠀⠀⠀⠿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⣭⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⣤⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⠿
⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⠿
⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠉⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠉⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣿⠛⠿⣿⣤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣿⠀⠀⠀⣿⣿⣤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⣶⣿⠛⠉
⠀⠀⠀⠀⠀⠀⠀⠀⣤⣿⣿⠀⠀⠉
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉

⠀⠀⠀⠀⠀⠀⣶⣿⣶
⠀⠀⠀⣤⣤⣤⣿⣿⣿
⠀⠀⣶⣿⣿⣿⣿⣿⣿⣿⣶
⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⣿⣉⣿⣿⣿⣿⣉⠉⣿⣶
⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿
⠀⣤⣿⣿⣿⣿⣿⣿⣿⠿⠀⣿⣶
⣤⣿⠿⣿⣿⣿⣿⣿⠿⠀⠀⣿⣿⣤
⠉⠉⠀⣿⣿⣿⣿⣿⠀⠀⠒⠛⠿⠿⠿
⠀⠀⠀⠉⣿⣿⣿⠀⠀⠀⠀⠀⠀⠉
⠀⠀⠀⣿⣿⣿⣿⣿⣶
⠀⠀⠀⠀⣿⠉⠿⣿⣿
⠀⠀⠀⠀⣿⣤⠀⠛⣿⣿
⠀⠀⠀⠀⣶⣿⠀⠀⠀⣿⣶
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣭⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⣤⣿⣿⠉

⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣶
⠀⠀⠀⠀⠀⣀⣀⠀⣶⣿⣿⠶
⣶⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣤⣤
⠀⠉⠶⣶⣀⣿⣿⣿⣿⣿⣿⣿⠿⣿⣤⣀
⠀⠀⠀⣿⣿⠿⠉⣿⣿⣿⣿⣭⠀⠶⠿⠿
⠀⠀⠛⠛⠿⠀⠀⣿⣿⣿⣉⠿⣿⠶
⠀⠀⠀⠀⠀⣤⣶⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⠒
⠀⠀⠀⠀⣀⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⣿⣿⣿⠛⣭⣭⠉
⠀⠀⠀⠀⠀⣿⣿⣭⣤⣿⠛
⠀⠀⠀⠀⠀⠛⠿⣿⣿⣿⣭
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠉⠛⠿⣶⣤
⠀⠀⠀⠀⠀⠀⣀⣿⠀⠀⣶⣶⠿⠿⠿
⠀⠀⠀⠀⠀⠀⣿⠛
⠀⠀⠀⠀⠀⠀⣭⣶

⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿
⠀⠀⣶⠀⠀⣀⣤⣶⣤⣉⣿⣿⣤⣀
⠤⣤⣿⣤⣿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣀
⠀⠛⠿⠀⠀⠀⠀⠉⣿⣿⣿⣿⣿⠉⠛⠿⣿⣤
⠀⠀⠀⠀⠀⠀⠀⠀⠿⣿⣿⣿⠛⠀⠀⠀⣶⠿
⠀⠀⠀⠀⠀⠀⠀⠀⣀⣿⣿⣿⣿⣤⠀⣿⠿
⠀⠀⠀⠀⠀⠀⠀⣶⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠿⣿⣿⣿⣿⣿⠿⠉⠉
⠀⠀⠀⠀⠀⠀⠀⠉⣿⣿⣿⣿⠿
⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠉
⠀⠀⠀⠀⠀⠀⠀⠀⣛⣿⣭⣶⣀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠉⠛⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣉⠀⣶⠿
⠀⠀⠀⠀⠀⠀⠀⠀⣶⣿⠿
⠀⠀⠀⠀⠀⠀⠀⠛⠿⠛

⠀⠀⠀⣶⣿⣶
⠀⠀⠀⣿⣿⣿⣀
⠀⣀⣿⣿⣿⣿⣿⣿
⣶⣿⠛⣭⣿⣿⣿⣿
⠛⠛⠛⣿⣿⣿⣿⠿
⠀⠀⠀⠀⣿⣿⣿
⠀⠀⣀⣭⣿⣿⣿⣿⣀
⠀⠤⣿⣿⣿⣿⣿⣿⠉
⠀⣿⣿⣿⣿⣿⣿⠉
⣿⣿⣿⣿⣿⣿
⣿⣿⣶⣿⣿
⠉⠛⣿⣿⣶⣤
⠀⠀⠉⠿⣿⣿⣤
⠀⠀⣀⣤⣿⣿⣿
⠀⠒⠿⠛⠉⠿⣿
⠀⠀⠀⠀⠀⣀⣿⣿
⠀⠀⠀⠀⣶⠿⠿⠛  
*/
