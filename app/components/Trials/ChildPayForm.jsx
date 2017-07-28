import React from 'react';
import { connect } from 'react-redux';
import { Tab } from 'react-bootstrap';
import StartDateSelector from 'StartDateSelector';
import SessionDatesSelector from 'SessionDatesSelector';
import {
  getCentreKey,
  getCalendarDates,
  getCKey,
  getSessionDates
} from 'helper';
import { updateStartDate } from 'actions';
import moment from 'moment';

class ChildPayForm extends React.Component {
  render() {
    const { payerKey, centres, calendars, dispatch, register } = this.props;
    const {
      venueId,
      ageGroup,
      currentClassDay,
      currentClassTime,
      startDate
    } = register[payerKey];

    //Get Calendar Dates
    const { classes } = centres[getCentreKey(centres, venueId)];
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
    calendars: state.calendars
  };
}

export default connect(mapStateToProps)(ChildPayForm);
