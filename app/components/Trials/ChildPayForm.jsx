import React from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter'
import StartDateSelector from 'StartDateSelector';
import SessionDatesSelector from 'SessionDatesSelector';
import {
  getCalendarDates,
  getCKey,
  getSessionDates
} from 'helper';
import { updateStartDate } from 'actions';

class ChildPayForm extends React.Component {
  render() {
    const { payerKey, calendars, dispatch, register, classes } = this.props;
    const {
      ageGroup,
      currentClassDay,
      currentClassTime,
      startDate
    } = register[payerKey];

    //Get Calendar Dates
    const timeDay = currentClassTime + ' (' + currentClassDay + ')';
    const cKey = getCKey(classes, ageGroup, timeDay);
    const calendar = calendars[cKey];
    const calendarDates = getCalendarDates(calendar);

    //Get Term & Dates
    const sessionDates = getSessionDates(calendar.terms, startDate);
    return (
      <div style={{ margin: '15px 0px' }}>
        <StartDateSelector
          startDate={startDate}
          calendarDates={calendarDates}
          handleChange={selectedDate =>
            dispatch(updateStartDate(selectedDate, payerKey))}
        />
        <SessionDatesSelector
          sessionDates={sessionDates}
          payerKey={payerKey}
          startDate={startDate}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    register: state.register,
    centres: state.centres,
    calendars: state.calendars,
    classes: filter(state.classes, { centreKey: state.selection.key })
  };
}

export default connect(mapStateToProps)(ChildPayForm);
