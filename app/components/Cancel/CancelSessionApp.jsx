import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { updateNavTitle } from 'actions';
import { getCentreCalendarDates, isDatePaid, isAttended } from 'helper';
import DateSelector from 'DateSelector';
import CancelClassItem from 'CancelClassItem';
import CancelClassModal from 'CancelClassModal';
import moment from 'moment';
import indexOf from 'lodash/indexOf';
import pull from 'lodash/pull';
import filter from 'lodash/filter';
import size from 'lodash/size';

class CancelSessionApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment(),
      termDates: [],
      filter: '',
      cancelList: [],
      show: false
    };
    this.handleClassSelect = this.handleClassSelect.bind(this);
    this.open = this.open.bind(this);
  }
  componentDidMount() {
    const { dispatch, calendars, selection } = this.props;
    dispatch(updateNavTitle('/m/cancel', selection.name + ' Cancel Session'));
    var termDates = getCentreCalendarDates(calendars, selection.key);
    this.setState({ termDates });
  }

  handleClassSelect(classKey) {
    let cancelList = this.state.cancelList;
    if (indexOf(cancelList, classKey) === -1) {
      cancelList.push(classKey);
      this.setState({ cancelList });
    } else {
      cancelList = pull(cancelList, classKey);
      this.setState({ cancelList });
    }
  }

  close() {
    this.setState({ show: false });
  }

  open(cancelClassList) {
    if (size(cancelClassList) !== 0) {
      this.setState({ show: true });
    }
  }

  onFormSubmit() {
    console.log('Cancelled');
  }

  render() {
    const { students, classes } = this.props;
    //filter active students only
    let activeStudents = filter(students, o => {
      return o.status !== 'Not Active';
    });

    //filter students that paid on the selected date
    let paidStudents = [];
    let classPaid = [];
    let attendedStudents = [];
    let classAttendance = [];
    let cancelClassList = [];
    this.state.cancelList.map(classKey => {
      const { ageGroup, startTime, endTime, day } = classes[classKey];
      let filteredStudents = filter(activeStudents, {
        ageGroup: ageGroup,
        currentClassTime: startTime + ' - ' + endTime,
        currentClassDay: day
      });
      paidStudents = filter(filteredStudents, o => {
        if (o.payments !== undefined) {
          return isDatePaid(o.payments, this.state.selectedDate);
        }
      });
      classPaid[classKey] = paidStudents;
      attendedStudents = filter(filteredStudents, o => {
        if (o.attendance !== undefined) {
          return isAttended(o.attendance, this.state.selectedDate);
        }
      });
      classAttendance[classKey] = attendedStudents;
      if (size(attendedStudents) === 0) {
        cancelClassList[classKey] = classes[classKey];
      }
    });

    return (
      <div>
        <CancelClassModal
          cancelClassList={cancelClassList}
          show={this.state.show}
          close={() => this.close.bind(this)}
          onFormSubmit={this.onFormSubmit.bind(this)}
        />
        <DateSelector
          termDates={this.state.termDates}
          selectedDate={this.state.selectedDate}
          handleChange={date => this.setState({ selectedDate: date })}
        />
        {Object.keys(classes).map(classKey => {
          const { ageGroup, startTime, endTime, day } = classes[classKey];
          const name = ageGroup + ' ' + startTime + ' - ' + endTime + ' ' + day;
          return (
            <CancelClassItem
              key={classKey}
              name={name}
              handleChange={() => this.handleClassSelect(classKey)}
              paidStudents={size(classPaid[classKey])}
              attendedStudents={size(classAttendance[classKey])}
            />
          );
        })}
        <i style={{ marginLeft: '15px' }}>
          Note : You cannot cancel class with attendance
        </i>
        <button
          className="submitbtn"
          onClick={cancelClassList => this.open(cancelClassList)}
        >
          Cancel Classes
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    students: filter(state.students, { venueId: state.selection.id }),
    calendars: state.calendars,
    selection: state.selection,
    classes: state.selection.classes
  };
}

export default connect(mapStateToProps)(CancelSessionApp);
