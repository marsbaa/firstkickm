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
import { startMakeUps, updateNavTitle } from 'actions';
import StudentsFilter from 'StudentsFilter';
import Search from 'Search';
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
import filter from 'lodash/filter';
import size from 'lodash/size'
import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'

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

    if (isEmpty(makeUps)) {
      dispatch(startMakeUps());
    }
    dispatch(
      updateNavTitle('/m/attendance/', selection.name + ' Attendance')
    );

    var termDates = getCentreCalendarDates(calendars);
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
      classes,
      students,
      selection,
      calendars,
      makeUps,
      manager,
      allStudents,
      centres
    } = this.props;
    var html = [];
    classes = sortByEndTime(classes);
    if (this.state.filter !== '') {
      classes = filterByAMPM(classes, this.state.filter);
    }
    var filteredActive = getActive(students);
    var filteredNotActive = getNotActive(students);
    Object.keys(classes).forEach(classKey => {
      var { day, startTime, endTime, ageGroup, calendarKey } = classes[
        classKey
      ];

      var classTime = startTime + ' - ' + endTime;
      var classTimeDay = classTime + ' (' + day + ')';
      //Filter Students base on class

      var filteredActiveClass = filter(filteredActive, {
        currentClassDay: moment(this.state.startDate).format('dddd'),
        currentClassTime: classTime,
        ageGroup: ageGroup
      });

      //Display Class Header
      if (size(filteredActiveClass) !== 0) {
        var sortedActiveClass = sortBy(filteredActiveClass, ['childName']);
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
        var filteredMakeUps = filter(makeUps, {
          toCentre: selection.key,
          toDate: moment(this.state.startDate).format('YYYY-MM-DD'),
          ageGroup: ageGroup,
          toClassTimeDay: classTimeDay
        });
        if (!isEmpty(filteredMakeUps)) {
          Object.keys(filteredMakeUps).forEach(makeUpId => {
            const { studentKey } = filteredMakeUps[makeUpId];
            const student = find(allStudents, { key: studentKey });
            const centreName = find(centres, { id: student.venueId }).name;
            if (student !== undefined) {
              html.push(
                <Attendee
                  key={studentKey}
                  student={student}
                  date={this.state.startDate}
                  type="makeup"
                  centreName={centreName}
                />
              );
            }
           
          });
        }
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
    console.log('Attendance')
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
        {manager
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

function mapStateToProps(state) {
  return {
    classes: filter(state.classes, { centreKey: state.selection.key }),
    students: StudentsFilter.filter(
      state.students,
      state.selection.id,
      state.searchText
    ),
    centres: state.centres,
    allStudents: state.students,
    selection: state.selection,
    calendars: filter(state.calendars, {centreKey: state.selection.key}),
    makeUps: state.makeUps,
    manager: isManager(state.auth, state.users)
  };
}

export default connect(mapStateToProps)(AttendanceList);
