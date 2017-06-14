import React from 'react';
import { Link } from 'react-router';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonGroup,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Attendee from 'Attendee';
import AttendanceClassList from 'AttendanceClassList';
var actions = require('actions');
import StudentsFilter from 'StudentsFilter';
import Search from 'Search';
import _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getActive,
  getNotActive,
  getCentreCalendarDates,
  sortByEndTime,
  filterByAMPM,
  classToday,
  isManager
} from 'helper';

class AttendanceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      termDates: [],
      filter: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    var { dispatch, selection, calendars, makeUps } = this.props;

    if (_.isEmpty(makeUps)) {
      dispatch(actions.startMakeUps());
    }
    dispatch(
      actions.updateNavTitle('/m/attendance/HQ', selection.name + ' Attendance')
    );

    var termDates = getCentreCalendarDates(calendars, selection.key);
    this.setState({ termDates });
  }

  handleSelect(e) {
    e.preventDefault();
    var id = e.target.id;
    var className = e.target.className;
    if (id === 'all' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('am').className = 'normalbtn btn btn-default';
      document.getElementById('pm').className = 'normalbtn btn btn-default';
      this.setState({ filter: '' });
    } else if (id === 'am' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('all').className = 'normalbtn btn btn-default';
      document.getElementById('pm').className = 'normalbtn btn btn-default';
      this.setState({ filter: 'am' });
    } else if (id === 'pm' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('all').className = 'normalbtn btn btn-default';
      document.getElementById('am').className = 'normalbtn btn btn-default';
      this.setState({ filter: 'pm' });
    }
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    var {
      students,
      searchText,
      selection,
      calendars,
      makeUps,
      auth,
      users
    } = this.props;
    var html = [];

    var classes = selection.classes;
    classes = sortByEndTime(classes);
    if (this.state.filter !== '') {
      classes = filterByAMPM(classes, this.state.filter);
    }
    var filteredStudents = StudentsFilter.filter(
      students,
      selection.id,
      searchText
    );
    var filteredActive = getActive(filteredStudents);
    var filteredNotActive = getNotActive(filteredStudents);

    Object.keys(classes).forEach(classKey => {
      var { day, startTime, endTime, ageGroup, calendarKey } = classes[
        classKey
      ];

      var classTime = startTime + ' - ' + endTime;
      var classTimeDay = classTime + ' (' + day + ')';
      //Filter Students base on class

      var filteredActiveClass = _.filter(filteredActive, {
        currentClassDay: moment(this.state.startDate).format('dddd'),
        currentClassTime: classTime,
        ageGroup: ageGroup
      });

      //Display Class Header
      if (_.size(filteredActiveClass) !== 0) {
        var sortedActiveClass = _.sortBy(filteredActiveClass, ['childName']);
        html.push(
          <AttendanceClassList
            key={ageGroup + classTimeDay}
            name={ageGroup + ' ' + classTimeDay}
            group={sortedActiveClass}
            date={this.state.startDate}
            makeUps={makeUps}
          />
        );

        //Display Make Up List
        var filteredMakeUps = _.filter(makeUps, {
          toCentre: selection.key,
          toDate: moment(this.state.startDate).format('YYYY-MM-DD'),
          ageGroup: ageGroup,
          toClassTimeDay: classTimeDay
        });

        Object.keys(filteredMakeUps).forEach(makeUpId => {
          html.push(
            <Attendee
              key={student.key}
              student={student}
              date={this.state.startDate}
              type="makeup"
            />
          );
        });
      }
    });
    //Display Not Active List
    if (classToday(calendars, selection.key, this.state.startDate)) {
      html.push(
        <AttendanceClassList
          key="Not Active"
          name="Not Active"
          group={filteredNotActive}
          date={this.state.startDate}
        />
      );
    } else {
      html.push(
        <div key="Noclass" style={{ textAlign: 'center', paddingTop: '20px' }}>
          <h5>No Class Today</h5>
        </div>
      );
    }

    return (
      <Grid style={{ padding: '10px 0px' }}>
        <Row
          style={{
            padding: '8px 10px',
            borderBottom: '1px solid #cccccc',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Col xs={7} md={7}>
            <Search type="student" />
          </Col>
          <Col xs={5} md={5}>
            <ButtonGroup>
              <Button
                id="all"
                style={{ margin: '0px' }}
                className="selectedbtn"
                onClick={this.handleSelect.bind(this)}
              >
                All
              </Button>
              <Button
                id="am"
                style={{ margin: '0px' }}
                className="normalbtn"
                onClick={this.handleSelect.bind(this)}
              >
                AM
              </Button>
              <Button
                id="pm"
                style={{ margin: '0px' }}
                className="normalbtn"
                onClick={this.handleSelect.bind(this)}
              >
                PM
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        {isManager(auth, users)
          ? <Row
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid #cccccc',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Col xs={12} md={12}>
                <FormGroup style={{ marginBottom: '0' }}>
                  <ControlLabel>Date of Session</ControlLabel>
                  <DatePicker
                    id="datePicker"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.startDate}
                    includeDates={this.state.termDates}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          : null}
        {html}
      </Grid>
    );
  }
}

export default connect(state => {
  return state;
})(AttendanceList);
