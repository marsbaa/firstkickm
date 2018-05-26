import React from "react";
import moment from "moment";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { updateNavTitle, addMakeUp } from "actions";
import {
  Panel,
  Grid,
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Radio
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCentreCalendarDates, getClosestDate } from "helper";

class AttendanceMakeUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: moment(),
      toDate: moment(),
      fromTermDates: [],
      toTermDates: [],
      selectedCentreTo: ""
    };
    this.handleChangeFrom = this.handleChangeFrom.bind(this);
    this.handleChangeTo = this.handleChangeTo.bind(this);
    this.centreSelectTo = this.centreSelectTo.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentWillMount() {
    var { dispatch, selection, calendars } = this.props;
    dispatch(updateNavTitle("/m/attendance/HQ", "Make Up Form"));

    var termDates = getCentreCalendarDates(calendars, selection.key);
    var fromDate = getClosestDate(termDates);

    this.setState({ fromTermDates: termDates });
    this.setState({ toTermDates: termDates });
    this.setState({ toDate: moment(fromDate) });
    this.setState({ fromDate: moment(fromDate) });
    this.setState({ selectedCentreTo: selection.key });
  }

  handleChangeFrom(date) {
    this.setState({
      fromDate: date
    });
  }

  handleChangeTo(date) {
    this.setState({
      toDate: date
    });
  }

  centreSelectTo(e) {
    e.preventDefault();
    var { calendars } = this.props;
    var termDates = getCentreCalendarDates(calendars, e.target.value);
    var toDate = getClosestDate(termDates);
    this.setState({ toDate: moment(toDate) });
    this.setState({
      selectedCentreTo: e.target.value
    });
    this.setState({ toTermDates: termDates });
  }

  onFormSubmit(e) {
    e.preventDefault();
    var { dispatch, selection, students } = this.props;
    var studentKey = this.props.params.studentId;
    var student = _.find(students, { key: studentKey });
    var makeUp = {
      fromDate: document.getElementById("fromDate").value,
      toDate: document.getElementById("toDate").value,
      fromCentre: selection.key,
      toCentre: document.getElementById("toCentre").value,
      fromClassTimeDay: document.getElementById("fromClassTimeDay").value,
      toClassTimeDay: document.getElementById("toClassTimeDay").value,
      ageGroup: student.ageGroup,
      studentKey
    };
    if (makeUp.toCentre !== "0") {
      if (makeUp.toClassTimeDay !== "0") {
        dispatch(addMakeUp(makeUp));
        browserHistory.push("/m/makeup");
      }
    }
  }

  render() {
    var { centres, students, selection } = this.props;
    var studentId = this.props.params.studentId;
    var student = _.find(students, { key: studentId });
    //Centre List
    var centreOptions = [];
    centreOptions.push(
      <option key="0" value="0">
        select
      </option>
    );
    Object.keys(centres).map(centreKey => {
      var centre = centres[centreKey];
      centreOptions.push(
        <option key={centre.key} value={centre.key}>
          {_.upperFirst(centre.name)}
        </option>
      );
    });

    //Class TimeSlots From
    var classTimeSlotsTo = [];
    classTimeSlotsTo.push(
      <option key="0" value="0">
        select
      </option>
    );
    var centreTo = centres[this.state.selectedCentreTo];

    Object.keys(centreTo.classes).forEach(classID => {
      var cla = centreTo.classes[classID];
      if (cla.ageGroup === student.ageGroup) {
        var classTime = cla.startTime + " - " + cla.endTime;
        var classTimeDay = classTime + " (" + _.capitalize(cla.day) + ")";
        classTimeSlotsTo.push(
          <option key={classTimeDay} value={classTimeDay}>
            {classTimeDay}
          </option>
        );
      }
    });

    return (
      <Grid style={{ marginTop: "20px" }}>
        <Panel>
          <Panel.Heading>From</Panel.Heading>
          <Panel.Body>
            <Row style={{ padding: "10px" }}>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Selected Centre</ControlLabel>
                  <FormControl
                    id="fromCentre"
                    type="text"
                    disabled
                    defaultValue={selection.name}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Selected Class Time</ControlLabel>
                  <FormControl
                    id="fromClassTimeDay"
                    type="text"
                    disabled
                    defaultValue={
                      student.currentClassTime +
                      " (" +
                      _.capitalize(student.currentClassDay) +
                      ")"
                    }
                  />
                </FormGroup>
                <FormGroup style={{ marginTop: "30px" }}>
                  <ControlLabel>Selected Date</ControlLabel>
                  <DatePicker
                    id="fromDate"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.fromDate}
                    includeDates={this.state.fromTermDates}
                    onChange={this.handleChangeFrom}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Panel.Body>
        </Panel>
        <Panel>
          <Panel.Heading>To</Panel.Heading>
          <Panel.Body>
            <Row style={{ padding: "10px" }}>
              <Col md={6}>
                <FormGroup>
                  <ControlLabel>Selected Centre</ControlLabel>
                  <FormControl
                    id="toCentre"
                    componentClass="select"
                    placeholder="select"
                    onChange={this.centreSelectTo}
                  >
                    {centreOptions}
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Selected Class Time</ControlLabel>
                  <FormControl
                    id="toClassTimeDay"
                    componentClass="select"
                    placeholder="select"
                  >
                    {classTimeSlotsTo}
                  </FormControl>
                </FormGroup>
                <FormGroup style={{ marginTop: "30px" }}>
                  <ControlLabel>Selected Date</ControlLabel>
                  <DatePicker
                    id="toDate"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.toDate}
                    includeDates={this.state.toTermDates}
                    onChange={this.handleChangeTo}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Panel.Body>
        </Panel>
        <button className="submitbtn" onClick={this.onFormSubmit}>
          Submit Make Up
        </button>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    selection: state.selection,
    centres: state.centres,
    calendars: state.calendars,
    students: state.students
  };
}

export default connect(mapStateToProps)(AttendanceMakeUp);
