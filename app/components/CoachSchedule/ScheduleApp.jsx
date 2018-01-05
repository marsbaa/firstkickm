import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { startCoaches } from 'CoachesActions';
import { updateNavTitle, startCoachSchedule } from 'actions';
import ScheduleTermButton from 'ScheduleTermButton';
import moment from 'moment';
import _ from 'lodash';
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import slice from 'lodash/slice'

class ScheduleApp extends React.Component {
  componentWillMount() {
    var { dispatch, coaches, coachSchedule } = this.props;
    if (isEmpty(coaches)) {
      dispatch(startCoaches());
    }
    if (isEmpty(coachSchedule)) {
      dispatch(startCoachSchedule());
    }
  }

  componentDidMount() {
    var { dispatch } = this.props;
    dispatch(updateNavTitle('/m/coachschedule', 'Coach Scheduling'));
  }

  render() {
    var { calendars } = this.props;
    var termDates = [];
    var count = 0;
    Object.keys(calendars).map(calendarKey => {
      var calendar = calendars[calendarKey];
      Object.keys(calendar.terms).map(year => {
        Object.keys(calendar.terms[year]).map(termId => {
          var term = calendar.terms[year][termId];
          term.map((date, dateID) => {
            var today = moment().subtract(2, 'week').format('YYYYMMDD');
            if (moment(date).isSameOrAfter(today, 'day')) {
              termDates.push({
                term: termId,
                session: parseInt(dateID) + 1,
                date,
                calendarKey: calendar.key
              });
            }
          });
        });
      })
    });

    var termDates = orderBy(
      termDates,
      ['date', 'term', 'session'],
      ['asc', 'asc', 'asc']
    );
    termDates = slice(termDates, 0, 8);
    var html = [];
    termDates.map(dateInfo => {
      html.push(
        <ScheduleTermButton
          key={dateInfo.date + dateInfo.calendarKey}
          term={dateInfo.term}
          title={'T' + dateInfo.term + '-S' + dateInfo.session}
          displayDate={moment(dateInfo.date).format('D MMM')}
          date={moment(dateInfo.date).format('YYYYMMDD')}
          calendarKey={dateInfo.calendarKey}
        />
      );
    });

    return (
      <div style={{ paddingTop: '20px' }}>
        <Row
          style={{
            paddingBottom: '8px',
            borderBottom: '1px solid #cccccc',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Col xs={12} md={12}>
            {html}
          </Col>
        </Row>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selection: state.selection,
    calendars: filter(state.calendars, {centreKey: state.selection.key}),
    coaches: state.coaches,
    coachSchedule: state.coachSchedule
  };
}
export default connect(mapStateToProps)(ScheduleApp);
