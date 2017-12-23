import React from 'react';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button
} from 'react-bootstrap';
import TimePicker from 'react-timepicker';
import moment from 'moment';
import { addNewClass } from 'actions';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import 'react-timepicker/timepicker.css';
import filter from 'lodash/filter';

class ClassEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: '',
      endTime: '',
      ageGroup: '',
      day: '',
      term: '',
      year: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.goBack = this.goBack.bind(this);
    this.saveClass = this.saveClass.bind(this);
    this.generateAgeGroups = this.generateAgeGroups.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      ageGroup: e.target.value
    });
  }

  handleYearChange(e) {
    e.preventDefault();
    this.setState({
      year: e.target.value
    });
  }

  handleDayChange(e) {
    e.preventDefault();
    this.setState({
      day: e.target.value
    });
  }

  handleTermChange(e) {
    e.preventDefault();
    this.setState({
      term: e.target.value
    });
  }

  onChangeStartTime(hours, minutes) {
    var formattedHours, formattedMinutes, amPm;
    if (hours < 12) {
      formattedHours = hours;
      amPm = 'am';
    } else if (hours === 12) {
      amPm = 'pm';
      formattedHours = hours;
    } else {
      formattedHours = hours - 12;
      amPm = 'pm';
    }

    if (minutes < 10) {
      formattedMinutes = '0' + minutes;
    } else {
      formattedMinutes = minutes;
    }
    var time = formattedHours + ':' + formattedMinutes + amPm;
    this.setState({ startTime: time });
  }

  onChangeEndTime(hours, minutes) {
    var formattedHours, formattedMinutes, amPm;
    if (hours < 12) {
      formattedHours = hours;
      amPm = 'am';
    } else if (hours === 12) {
      amPm = 'pm';
      formattedHours = hours;
    } else {
      formattedHours = hours - 12;
      amPm = 'pm';
    }

    if (minutes < 10) {
      formattedMinutes = '0' + minutes;
    } else {
      formattedMinutes = minutes;
    }
    var time = formattedHours + ':' + formattedMinutes + amPm;
    this.setState({ endTime: time });
  }

  goBack(e) {
    e.preventDefault();
    browserHistory.push('/m/centres/' + this.props.params.centreKey);
  }

  saveClass(e) {
    e.preventDefault();
    let { dispatch, centre } = this.props;

    let cla = {
      ageGroup: this.state.ageGroup,
      day: this.state.day,
      calendarKey: this.state.term,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      venueId: centre.id,
      centreName: centre.name,
      centreKey: centre.key,
      year: this.state.year,
      name: `${this.state.ageGroup} ${this.state.startTime} - ${this.state
        .endTime} (${this.state.day})`
    };
    dispatch(addNewClass(cla));
    browserHistory.push('/m/centres/' + centre.key);
  }

  generateAgeGroups() {
    var { ageGroup } = this.props;
    var html = [];
    html.push(
      <option key="select" value="select">
        Select Age Group
      </option>
    );
    ageGroup.map(age => {
      html.push(
        <option key={age.key} value={age.name}>
          {age.name}
        </option>
      );
    });
    return html;
  }

  generateYear() {
    var html = [];
    html.push(
      <option key="select" value="select">
        Select Year
      </option>
    );
    let currentYear = moment().year();
    for (var i = 0; i < 3; i++) {
      html.push(
        <option key={currentYear + i} value={currentYear + i}>
          {currentYear + i}
        </option>
      );
    }

    return html;
  }

  render() {
    const { classes, calendars } = this.props;

    return (
      <Grid style={{ marginTop: '20px' }}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Year</ControlLabel>
              <FormControl
                id="selectYear"
                componentClass="select"
                onChange={this.handleYearChange}
              >
                {this.generateYear()}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Age Group</ControlLabel>
              <FormControl
                id="selectAgeGroup"
                componentClass="select"
                onChange={this.handleChange}
              >
                {this.generateAgeGroups()}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Day of Week</ControlLabel>
              <FormControl
                id="selectDay"
                componentClass="select"
                onChange={this.handleDayChange}
              >
                <option value="select">Select Day of Week</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Term Calendar</ControlLabel>
              <FormControl
                id="selectTerm"
                componentClass="select"
                onChange={this.handleTermChange}
              >
                <option value="select">Select Term to Follow</option>
                {Object.keys(calendars).map(calendarKey => {
                  const { name, key, centreKey } = calendars[calendarKey];
                  return (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  );
                })}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Start Time</ControlLabel>
              <TimePicker onChange={this.onChangeStartTime} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>End Time</ControlLabel>
              <TimePicker onChange={this.onChangeEndTime} />
            </FormGroup>

            <Button onClick={this.goBack}>Cancel</Button>
            <Button onClick={this.saveClass}>Save</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    centre: state.centres[props.params.centreKey],
    calendars: filter(state.calendars, { centreKey: props.params.centreKey }),
    classes: filter(state.classes, { centreKey: props.params.centreKey }),
    ageGroup: state.ageGroup
  };
}

export default connect(mapStateToProps)(ClassEdit);
