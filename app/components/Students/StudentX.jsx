import React from "react";
import { connect } from "react-redux";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Row,
  Col,
  Glyphicon
} from "react-bootstrap";
import { boy, girl } from "styles.css";
import { Link } from "react-router";
import moment from "moment";
import truncate from "lodash/truncate";
import find from "lodash/find";
import filter from "lodash/filter";

class StudentX extends React.Component {
  render() {
    var { users, auth, classes } = this.props;
    var user = find(users, ["email", auth.email]);
    var {
      childName,
      key,
      gender,
      contact,
      ageGroup,
      currentClassTime,
      currentClassDay
    } = this.props.student;
    var truncatedName = truncate(childName, {
      length: 28
    });
    var studentClass = `${ageGroup} ${currentClassTime} (${currentClassDay})`

    //Class TimeSlots
    let classTimeSlots = [];
    classTimeSlots.push(
      <option key="0" value="0">
        select
      </option>
    );
    Object.keys(classes).forEach(classKey => {
      let { name } = classes[classKey];
      classTimeSlots.push(
        <option key={name} value={name}>
          {name}
        </option>
      );
    });
    return (
      <Row
        key={key}
        style={{
          padding: "8px 10px",
          borderBottom: "1px solid #cccccc",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Col xs={6} md={6} style={{ fontSize: "14px" }}>
          <Glyphicon glyph="user" />{" "}
          <font className={gender}>{truncatedName}</font>
        </Col>
        <Col xs={6} md={6} style={{ textAlign: "right" }}>
          <FormGroup>
            <FormControl
              id="timeSlotSelect"
              componentClass="select"
              placeholder="select"
              defaultValue={studentClass}
            >
              {classTimeSlots}
            </FormControl>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
    auth: state.auth,
    classes: filter(state.classes, { centreKey: state.selection.key })
  };
}

export default connect(mapStateToProps)(StudentX);
