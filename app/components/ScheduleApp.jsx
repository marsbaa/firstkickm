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
    var {dispatch, coaches} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
    }
  }

  render() {
    var {selection, centres, calendars} = this.props;
    var centreKey;
    centres.map((c) => {
      if(c.id === selection) {
        centreKey = c.key;
      }
    });
    var termDates = [];
    var count=0;
    calendars.map((calendar) => {
      if (calendar.centreKey === centreKey) {
        calendar.terms.map((term, termID) => {
          term.map((date, dateID) => {
            if (moment(date).isAfter() && count < 8) {
              termDates.push({
                term: termID,
                session: parseInt(dateID)+1,
                date,
                calendarKey: calendar.key
              });
              count++;
            }
          })
        })
      }
    })

    var termDates = _.orderBy(termDates, ['term', 'session'], ['asc', 'asc']);

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
