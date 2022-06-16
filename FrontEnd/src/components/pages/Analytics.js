import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import {
  getSearchedData,
  getAvgData,
  get1MinAvgData,
} from "../../actions/dataActions";

import "../scss/Dashboard.css";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import Chart from "react-apexcharts";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.updateCharts = this.updateCharts.bind(this);
    this.handleChange1MinAvg = this.handleChange1MinAvg.bind(this);
    this.handleChange5MinAvg = this.handleChange5MinAvg.bind(this);
    this.handleChange15MinAvg = this.handleChange15MinAvg.bind(this);
    this.state = {
      deviceid: " ",
      dateFrom:
        new Date(new Date().getTime() - 120 * 60000)
          .toISOString()
          .substr(0, new Date().toISOString().length - 7) + "00",
      dateTo:
        new Date()
          .toISOString()
          .substr(0, new Date().toISOString().length - 7) + "00",
      dataType: "15-min-avg",
      // props that can be pass to the React-ApexCharts component
      series: [
        // The data which you want to display in the chart
        {
          name: "Awair Score",
          data: [],
        },
        {
          name: "Temp",
          data: [],
        },
        {
          name: "Humid",
          data: [],
        },
        {
          name: "CO2",
          data: [],
        },
        {
          name: "VOCs",
          data: [],
        },
        {
          name: "PM2.5",
          data: [],
        },
      ],
      options: {
        chart: {
          height: 350, // Height of the chart
          type: "line", // chart type
          zoom: {
            enabled: false,
          },
          toolbar: {
            export: {
              csv: {
                // set csv download configurations
                filename: undefined,
                columnDelimiter: ",",
                headerCategory: "category",
                headerValue: "value",
                dateFormatter(timestamp) {
                  return new Date(timestamp).toString();
                },
              },
              svg: {
                // set image download configurations in svg format
                filename: undefined,
              },
              png: {
                // set image download configurations in png format
                filename: undefined,
              },
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 1,
        },
        title: {
          text: " ",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            datetimeUTC: false,
          },
        },
        // will display a box that display x and y coordinate when hover over a coordinate in graph
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(2); // set value to 2 decimal places
            },
          },
          x: {
            show: true,
            format: "dd/MM hh:mm TT", // format date
          },
        },

        yaxis: {
          tickAmount: 3,
          labels: {
            formatter: function (val) {
              return val.toFixed(2);
            },
          },
          title: {
            text: "Score",
            style: {
              fontSize: "14px",
              fontWeight: 600,
            },
          },
        },
      },
    };
  }

  // set graph title and name of file downloaded
  setTitle(deviceid, dataType, dateFrom, dateTo) {
    let graphTitle =
      "Device " +
      deviceid +
      " ( " +
      dataType +
      " AWAIR AQI past " +
      Math.ceil((new Date(dateTo) - new Date(dateFrom)) / 3600000) +
      " hours )";
    this.setState({
      options: {
        title: {
          text: graphTitle,
        },
        chart: {
          toolbar: {
            export: {
              csv: {
                filename: graphTitle,
              },
              svg: {
                filename: graphTitle,
              },
              png: {
                filename: graphTitle,
              },
            },
          },
        },
      },
    });
  }

  componentDidMount() {
    const orders = this.props.sensordata.data;
    // if user has chosen the device id in dashboard page
    if (orders !== undefined) {
      // if json object is complete
      if (orders.length > 1) {
        const deviceid = orders[orders.length - 1].device_id;

        this.props.getAvgData(
          deviceid,
          this.state.dateFrom,
          this.state.dateTo,
          this.state.dataType
        );
        this.setTitle(
          deviceid,
          this.state.dataType,
          this.state.dateFrom,
          this.state.dateTo
        );
        this.setState({ deviceid: deviceid });
      }
    }
  }

  // set time range to display graph data
  handleDataRangeChange = (e) => {
    e.preventDefault();
    const orders = this.props.sensordata.graphdata;

    if (orders !== undefined) {
      if (orders.length > 1) {
        this.pickDate(e.target.value);
      }
    }
  };

  // pass current datetime to props
  setDateState(range) {
    let date =
      new Date(new Date().getTime() - range * 60000)
        .toISOString()
        .substr(0, new Date().toISOString().length - 7) + "00";
    this.setState({
      dateFrom: date,
    });
  }

  // capture user option on time range to display data
  pickDate(datetime) {
    switch (datetime) {
      case "2":
        this.setDateState(120);
        break;
      case "12":
        this.setDateState(720);
        break;
      case "24":
        this.setDateState(1440);
        break;
      default:
        this.setDateState(120);
    }
  }

  // set the data type to 1 min average
  handleChange1MinAvg() {
    const orders = this.props.sensordata.graphdata;
    if (orders !== undefined) {
      this.setState({ dataType: "1-min-avg" });
    }
  }

  // set the data type to 5 min average
  handleChange5MinAvg() {
    const orders = this.props.sensordata.graphdata;
    if (orders !== undefined) {
      if (orders.length > 1) {
        this.setState({ dataType: "5-min-avg" });
      }
    }
  }

  // set the data type to 15 min average
  handleChange15MinAvg() {
    const orders = this.props.sensordata.graphdata;
    if (orders !== undefined) {
      if (orders.length > 1) {
        this.setState({ dataType: "15-min-avg" });
      }
    }
  }

  // return charts data (awair score) in 1 min interval
  updateChartsScore1MinAvg() {
    const orders = this.props.sensordata.graphdata;
    const graph = [];
    let length = orders.length;
    for (var i = 0; i < length - 2; i++) {
      let data = [];
      let date = new Date(orders[i].timestamp);
      data.push(date.toLocaleString());
      data.push(orders[i].score);
      graph.push(data);
    }
    return graph;
  }

  // return charts data (awair score) in 5 or 15 min interval
  updateChartsScoreNot1MinAvg() {
    const orders = this.props.sensordata.graphdata;
    const graph = [];

    orders[0].map((order) => {
      let data = [];
      for (var i = 0; i < 2; i++) {
        if (i === 0) {
          let date = new Date(order.timestamp);
          data.push(date.toLocaleString());
        } else {
          data.push(order.score);
        }
      }
      graph.push(data);
      return graph;
    });

    return graph;
  }

  // return charts data (other five Airdata type score) in 1 min interval
  updateChartsType1MinAvg(comp) {
    const orders = this.props.sensordata.graphdata;
    const graph = [];
    let length = orders.length;
    for (var i = 0; i < length - 2; i++) {
      let data = [];
      let date = new Date(orders[i].timestamp);
      data.push(date.toLocaleString());
      orders[i].sensors.map((sensor) => {
        if (sensor.comp === comp) {
          data.push(sensor.value);
        }
        return graph;
      });
      graph.push(data);
    }
    return graph;
  }

  // return charts data (other five Airdata type score) in 1 min interval
  updateChartsTypeNot1MinAvg(comp) {
    const orders = this.props.sensordata.graphdata;
    const graph = [];

    orders[0].map((order) => {
      let data = [];
      for (var i = 0; i < 2; i++) {
        if (i === 0) {
          let date = new Date(order.timestamp);
          data.push(date.toLocaleString());
        } else {
          order.sensors.map((sensor) => {
            if (sensor.comp === comp) {
              data.push(sensor.value);
            }
            return graph;
          });
        }
      }
      graph.push(data);
      return graph;
    });

    return graph;
  }

  // disable update button for an amount of time set
  disableButton(mybutton, millisecond) {
    mybutton.disabled = true;
    setTimeout(function () {
      mybutton.disabled = false;
    }, millisecond);
  }

  // update and render charts data and components
  updateCharts() {
    var mybutton = document.getElementById("updatechart");
    var datediff = Math.ceil(
      (new Date(this.state.dateTo) - new Date(this.state.dateFrom)) / 3600000
    ); // time range
    // if chart data needs to be rendered in 1 min interval
    if (this.state.dataType === "1-min-avg") {
      this.props.get1MinAvgData(
        this.state.deviceid,
        this.state.dateFrom,
        this.state.dateTo
      );
    }
    // if chart data needs to be rendered in 5 or 15 min interval
    else {
      this.props.getAvgData(
        this.state.deviceid,
        this.state.dateFrom,
        this.state.dateTo,
        this.state.dataType
      );
    }
    this.setTitle(
      this.state.deviceid,
      this.state.dataType,
      this.state.dateFrom,
      this.state.dateTo
    );
    if (this.state.dataType === "1-min-avg") {
      if (datediff === 12) {
        this.disableButton(mybutton, 3250);
      } else if (datediff === 24) {
        this.disableButton(mybutton, 7000);
      } else {
        this.disableButton(mybutton, 500);
      }
    } else {
      this.disableButton(mybutton, 500);
    }
  }

  // pass data extracted from json onject to props
  renderChart() {
    const newMixedSeries = [];
    const orders = this.props.sensordata;
    if (orders !== undefined) {
      const data = orders.graphdata;
      // if json object has complete Airdata
      if (data !== undefined && data.length > 1) {
        // if data needs to be displayed in 1 min interval
        if (this.state.dataType !== "1-min-avg" && data.length < 3) {
          let graph = this.updateChartsScoreNot1MinAvg();
          let graph2 = this.updateChartsTypeNot1MinAvg("temp");
          let graph3 = this.updateChartsTypeNot1MinAvg("humid");
          let graph4 = this.updateChartsTypeNot1MinAvg("co2");
          let graph5 = this.updateChartsTypeNot1MinAvg("voc");
          let graph6 = this.updateChartsTypeNot1MinAvg("pm25");
          newMixedSeries.push({ data: graph });
          newMixedSeries.push({ data: graph2 });
          newMixedSeries.push({ data: graph3 });
          newMixedSeries.push({ data: graph4 });
          newMixedSeries.push({ data: graph5 });
          newMixedSeries.push({ data: graph6 });
          return (
            <Chart
              options={this.state.options}
              series={newMixedSeries}
              type="line"
              height={450}
            ></Chart>
          );
        }
        // if data needs to be displayed in 5 or 15 min interval
        else {
          let graph = this.updateChartsScore1MinAvg();
          let graph2 = this.updateChartsType1MinAvg("temp");
          let graph3 = this.updateChartsType1MinAvg("humid");
          let graph4 = this.updateChartsType1MinAvg("co2");
          let graph5 = this.updateChartsType1MinAvg("voc");
          let graph6 = this.updateChartsType1MinAvg("pm25");
          newMixedSeries.push({ data: graph });
          newMixedSeries.push({ data: graph2 });
          newMixedSeries.push({ data: graph3 });
          newMixedSeries.push({ data: graph4 });
          newMixedSeries.push({ data: graph5 });
          newMixedSeries.push({ data: graph6 });
          return (
            <Chart
              options={this.state.options}
              series={newMixedSeries}
              type="line"
              height={450}
            ></Chart>
          );
        }
      } else {
        return (
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={450}
          ></Chart>
        );
      }
    }
  }

  render() {
    return (
      <div className="dashboard d-flex">
        <div>
          <Sidebar />
        </div>
        <div
          style={{
            flex: "1 1 auto",
            display: "flex",
            flexFlow: "column",
            height: "100vh",
            overflowY: "hidden",
          }}
        >
          <Header />
          <div style={{ height: "100%" }}>
            <div style={{ height: "calc(100% - 20px)", overflowY: "scroll" }}>
              <div className="d-flex">
                <div className="mr-auto ml-5 mt-4">
                  <h3>Data Analytics</h3>
                </div>
              </div>

              <div className="d-flex card-section">
                <div className="cards-container">
                  <div className="card-bg w-100 border d-flex flex-column">
                    <div className="d-flex justify-content-between mb-3 border border-secondary">
                      <select
                        onChange={this.handleDataRangeChange}
                        style={{ height: "35px", width: "1180px" }}
                      >
                        <option value="2">Past 2 hours</option>
                        <option value="12">Past 12 hours</option>
                        <option value="24">Past 1 day</option>
                      </select>
                      <ButtonGroup
                        style={{ height: "35px", width: "230px" }}
                        aria-label="Basic example"
                      >
                        <Button
                          onClick={this.handleChange1MinAvg}
                          variant="secondary"
                          size="sm"
                          style={{
                            fontSize: "10px",
                            border: "1px solid #f2f2f2",
                          }}
                        >
                          1-min avg
                        </Button>
                        <Button
                          onClick={this.handleChange5MinAvg}
                          variant="secondary"
                          size="sm"
                          style={{
                            fontSize: "10px",
                            border: "1px solid #f2f2f2",
                          }}
                        >
                          5-min avg
                        </Button>
                        <Button
                          onClick={this.handleChange15MinAvg}
                          variant="secondary"
                          size="sm"
                          style={{
                            fontSize: "10px",
                            border: "1px solid #f2f2f2",
                          }}
                        >
                          15-min avg
                        </Button>
                      </ButtonGroup>
                    </div>

                    {this.renderChart()}
                    <button id="updatechart" onClick={this.updateCharts}>
                      Update!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// selecting the AirData from the store that select component needs.
// It is called every time the store state changes
const mapStateToProps = (state) => {
  return { sensordata: state.datas }; // return json object of AirData
};
export default connect(mapStateToProps, {
  getSearchedData,
  getAvgData,
  get1MinAvgData,
})(Analytics);
