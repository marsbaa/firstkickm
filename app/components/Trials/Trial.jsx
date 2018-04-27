import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Checkbox,
  Glyphicon,
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from "react-bootstrap";
import moment from "moment";
import { startToggleTrial } from "actions";
import { Link } from "react-router";
import Switch from "Switch";

class Trial extends React.Component {
  render() {
    const { dispatch } = this.props;
    const {
      id,
      childName,
      dateOfBirth,
      contact,
      email,
      gender,
      attended,
      attendedOn,
      registered,
      dateRegistered,
      timeOfTrial,
      deposit
    } = this.props.trial;
    let trialClassName = attended ? "trialCompleted" : "trial";
    let truncatedChildName = _.truncate(childName, {
      length: 16
    });

    const getAge = dob => {
      const now = moment();
      const dateofbirth = moment(dob, "YYYY-MM-DD");
      return now.diff(dateofbirth, "years");
    };

    return (
      <Row
        key={id}
        style={{
          backgroundColor: registered ? "#d7d7d7" : "none",
          padding: "8px 20px",
          borderBottom: "1px solid #cccccc",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Col xs={2} md={2} lg={2}>
          <Switch
            name={id + "attended"}
            checked={attended}
            onChange={() => {
              dispatch(startToggleTrial(id));
            }}
          />
        </Col>
        <Col xs={5} md={5} lg={5} style={{ paddingRight: "3px" }}>
          <div>
            <font className={trialClassName}>{truncatedChildName} </font>
            <font className={gender}>({getAge(dateOfBirth)})</font>
          </div>
          <div style={{ fontSize: "10px", color: "#9a9a9a" }}>
            <Glyphicon style={{ color: "#656565" }} glyph="time" />{" "}
            {timeOfTrial}
          </div>
          <div style={{ fontSize: "10px", color: "#9a9a9a" }}>
            <Glyphicon style={{ color: "#656565" }} glyph="phone" /> {contact}
          </div>
        </Col>
        {registered ? (
          <Col xs={5} md={5} lg={5} style={{ textAlign: "right" }}>
            Registered on {dateRegistered}
          </Col>
        ) : (
          <Col
            xs={5}
            md={5}
            lg={5}
            style={{
              textAlign: "right",
              paddingRight: "3px",
              paddingLeft: "3px"
            }}
          >
            <button
              className="innerbtn"
              onClick={() => this.props.open(childName, id)}
            >
              D
              {deposit === undefined
                ? ""
                : deposit === "0"
                  ? ""
                  : "$" + deposit}
            </button>
            <Link to={"/m/trials/edit/" + id} className="innerbtn">
              <Glyphicon glyph="pencil" style={{ padding: "2px 0px" }} />
            </Link>
            <Link to={"/m/trials/register/" + id} className="innerbtn">
              Register
            </Link>
          </Col>
        )}
      </Row>
    );
  }
}

export default connect()(Trial);
