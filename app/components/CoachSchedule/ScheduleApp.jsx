import React from 'react';
import {Link, browserHistory} from 'react-router'
import {connect} from 'react-redux';
import {Row, Col} from 'react-bootstrap'
var actions = require('actions');
import TermButton from 'TermButton'
import moment from 'moment'
import _ from 'lodash'


class ScheduleApp extends React.Component {
  componentWillMount () {
    var {dispatch, coaches, coachSchedule} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
    }
    if (_.isEmpty(coachSchedule)) {
      dispatch(actions.startCoachSchedule());
    }
  }

  componentDidMount() {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/coachschedule", "Coach Scheduling"));
  }

  render() {
    var {selection, calendars} = this.props;
    var termDates = [];
    var count=0;
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        Object.keys(calendar.terms).map((termId) => {
          var term = calendar.terms[termId]
          term.map((date, dateID) => {
            var today = moment().format("YYYYMMDD")
            if (moment(date).isSameOrAfter(today,'day')) {
              termDates.push({
                term: termIs,
                session: parseInt(dateID)+1,
                date,
                calendarKey: calendar.key
              });
            }
          })
        })
      }
    })

    var termDates = _.orderBy(termDates, ['term', 'session'], ['asc', 'asc']);
    termDates = _.slice(termDates, 0, 8);
    var html = [];
    termDates.map((dateInfo) => {
        html.push(<TermButton key={dateInfo.date} title={"T"+dateInfo.term+"-S"+dateInfo.session} displayDate={moment(dateInfo.date).format('D MMM')} date={moment(dateInfo.date).format('YYYYMMDD')}
        calendarKey = {dateInfo.calendarKey}
        />)
    })


    return (
      <div style={{paddingTop: '20px'}}>
        <Row style={{ paddingBottom: '8px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={12} md={12}>
          {html}
         </Col>
        </Row>
        {this.props.children}
      </div>
    );
  }
}

 export default connect((state) => {return state;
})(ScheduleApp);
