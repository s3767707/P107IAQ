import React, { Component } from "react";
import { connect } from "react-redux";
import { getSearchedData } from "../../../actions/dataActions";
import "../../scss/Dashboard.css";

class Score extends Component {
  renderLocation(building, floor) {
    return (
      <div>
        <h7 className="d-flex  justify-content-start fw-light">{building}</h7>
        <h7 className="d-flex justify-content-start fw-light">{floor}</h7>
      </div>
    );
  }

  renderDate() {
    return (
      <div>
        <h7 className="d-flex  justify-content-end fw-light">
          {new Date().toDateString()}
        </h7>
        <h7 className="d-flex justify-content-end fw-light">
          {new Date().toLocaleTimeString()}
        </h7>
      </div>
    );
  }

  renderLocationAndDate() {
    const orders = this.props.sensordata.data;
    if (orders !== undefined) {
      if (orders.length > 1) {
        if (orders[1].device_id === "26203") {
          return (
            <div className="awair2 mb-4">
              {this.renderLocation("Building 10", "Floor 10")}
              {this.renderDate()}
            </div>
          );
        } else if (orders[1].device_id === "25758") {
          return (
            <div className="awair2 mb-4">
              {this.renderLocation("Building 10", "Floor 9")}
              {this.renderDate()}
            </div>
          );
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  renderScore(score) {
    return (
      <div>
        <div className="mt-4 d-flex justify-content-center">Awair Score</div>
        <h4 className=" mt-3 d-flex justify-content-center">{score}</h4>
      </div>
    );
  }

  renderCircle(bgColor, orders) {
    return (
      <div>
        <div
          className="numberCircleParent"
          style={{
            backgroundColor: bgColor,
          }}
        >
          <div
            className="numberCircle"
            style={{
              backgroundColor: bgColor,
            }}
          >
            <span>{orders}</span>
          </div>
        </div>
      </div>
    );
  }

  renderIAQScore() {
    const orders = this.props.sensordata.data;

    if (orders.length > 1) {
      if (orders[0].length > 0) {
        const length = orders[0].length;
        if (orders[0][length - 1].score < 40) {
          return (
            <div className="awair">
              {this.renderCircle("#dd1111", orders[0][length - 1].score)}
              {this.renderScore("Bad")}
            </div>
          );
        } else if (orders[0][length - 1].score < 70) {
          return (
            <div className="awair">
              {this.renderCircle("#ffc124", orders[0][length - 1].score)}
              {this.renderScore("Fair")}
            </div>
          );
        } else {
          return (
            <div className="awair">
              {this.renderCircle("#1cdd11", orders[0][length - 1].score)}
              {this.renderScore("Good")}
            </div>
          );
        }
      } else {
        return (
          <div className="awair">
            {this.renderCircle("#adadad", "?")}
            {this.renderScore("-")}
          </div>
        );
      }
    } else {
      return (
        <div className="awair">
          {this.renderCircle("#adadad", "?")}
          {this.renderScore("-")}
        </div>
      );
    }
  }

  renderTypeScore(type) {
    const orders = this.props.sensordata.data;
    if (orders.length > 1) {
      if (orders[0].length > 0) {
        const length = orders[0].length;
        return orders[0][length - 1].sensors.map((sensor) => {
          if (sensor.comp === type) {
            return <span>{Math.round(sensor.value * 10) / 10}</span>;
          } else {
            return null;
          }
        });
      } else {
        return <span>-</span>;
      }
    } else {
      return <span>-</span>;
    }
  }

  renderTypeColor(type, range, range2, range3, range4) {
    const orders = this.props.sensordata.data;
    if (orders.length > 1) {
      if (orders[0].length > 0) {
        const length = orders[0].length;
        return orders[0][length - 1].sensors.map((sensor) => {
          if (sensor.comp === type) {
            if (sensor.value < range || sensor.value > range2) {
              return (
                <span
                  className="d-flex"
                  style={{
                    fontSize: "3em",
                    margin: "-1.5rem 0px -2rem 0px",
                    color: "#dd1111",
                  }}
                >
                  &#8226;
                </span>
              );
            } else if (sensor.value < range3 || sensor.value > range4) {
              return (
                <span
                  className="d-flex"
                  style={{
                    fontSize: "3em",
                    margin: "-1.5rem 0px -2rem 0px",
                    color: "#ffc124",
                  }}
                >
                  &#8226;
                </span>
              );
            } else {
              return (
                <span
                  className="d-flex"
                  style={{
                    fontSize: "3em",
                    margin: "-1.5rem 0px -2rem 0px",
                    color: "#1cdd11",
                  }}
                >
                  &#8226;
                </span>
              );
            }
          } else {
            return null;
          }
        });
      } else {
        return (
          <span
            className="d-flex"
            style={{
              fontSize: "3em",
              margin: "-1.5rem 0px -2rem 0px",
              color: "#adadad",
            }}
          >
            &#8226;
          </span>
        );
      }
    } else {
      return (
        <span
          className="d-flex"
          style={{
            fontSize: "3em",
            margin: "-1.5rem 0px -2rem 0px",
            color: "#adadad",
          }}
        >
          &#8226;
        </span>
      );
    }
  }

  renderType2Color(type, range, range2) {
    const orders = this.props.sensordata.data;
    if (orders.length > 1) {
      if (orders[0].length > 0) {
        const length = orders[0].length;
        return orders[0][length - 1].sensors.map((sensor) => {
          if (sensor.comp === type) {
            if (sensor.value > range) {
              return (
                <span
                  className="d-flex"
                  style={{
                    fontSize: "3em",
                    margin: "-1.5rem 0px -2rem 0px",
                    color: "#dd1111",
                  }}
                >
                  &#8226;
                </span>
              );
            } else if (sensor.value > range2) {
              return (
                <span
                  className="d-flex"
                  style={{
                    fontSize: "3em",
                    margin: "-1.5rem 0px -2rem 0px",
                    color: "#ffc124",
                  }}
                >
                  &#8226;
                </span>
              );
            } else {
              return (
                <span
                  className="d-flex"
                  style={{
                    fontSize: "3em",
                    margin: "-1.5rem 0px -2rem 0px",
                    color: "#1cdd11",
                  }}
                >
                  &#8226;
                </span>
              );
            }
          } else {
            return null;
          }
        });
      } else {
        return (
          <span
            className="d-flex"
            style={{
              fontSize: "3em",
              margin: "-1.5rem 0px -2rem 0px",
              color: "#adadad",
            }}
          >
            &#8226;
          </span>
        );
      }
    } else {
      return (
        <span
          className="d-flex"
          style={{
            fontSize: "3em",
            margin: "-1.5rem 0px -2rem 0px",
            color: "#adadad",
          }}
        >
          &#8226;
        </span>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderLocationAndDate()}
        {this.props.sensordata.data ? this.renderIAQScore() : ""}
        <div className="iaq">
          {this.props.sensordata.data
            ? this.renderTypeColor("temp", 11, 32, 18, 26)
            : ""}
          <span className="iaq-element">Temperature (&#8451;)</span>
          <span className="d-flex iaq-element justify-content-end">
            {this.props.sensordata.data ? this.renderTypeScore("temp") : ""}
          </span>
        </div>
        <div className="iaq">
          {this.props.sensordata.data
            ? this.renderTypeColor("humid", 20, 65, 40, 50)
            : ""}
          <span className="iaq-element">Humidity (&#37;)</span>
          <span className="d-flex iaq-element justify-content-end">
            {this.props.sensordata.data ? this.renderTypeScore("humid") : ""}
          </span>
        </div>
        <div className="iaq">
          {this.props.sensordata.data
            ? this.renderType2Color("co2", 1500, 600)
            : ""}
          <span className="iaq-element">
            CO<sub>2</sub> (ppm)
          </span>
          <span className="d-flex iaq-element justify-content-end">
            {this.props.sensordata.data ? this.renderTypeScore("co2") : ""}
          </span>
        </div>
        <div className="iaq">
          {this.props.sensordata.data
            ? this.renderType2Color("voc", 3333, 333)
            : ""}
          <span className="iaq-element">
            VOC<sub>s</sub> (ppb)
          </span>
          <span className="d-flex iaq-element justify-content-end">
            {this.props.sensordata.data ? this.renderTypeScore("voc") : ""}
          </span>
        </div>
        <div className="iaq">
          {this.props.sensordata.data
            ? this.renderType2Color("pm25", 55, 15)
            : ""}
          <span className="iaq-element">PM2.5 (&#181;g/m&sup2;)</span>
          <span className="d-flex iaq-element justify-content-end">
            {this.props.sensordata.data ? this.renderTypeScore("pm25") : ""}
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { sensordata: state.datas };
};
export default connect(mapStateToProps, { getSearchedData })(Score);