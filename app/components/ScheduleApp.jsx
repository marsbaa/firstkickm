import React from 'react';
import {Link, browserHistory} from 'react-router'
import {connect} from 'react-redux';
import {Row, Col} from 'react-bootstrap'
var actions = require('actions');
import TermButton from 'TermButton'
import moment from 'moment'
import _ from 'lodash'


export var ScheduleApp = React.createClass({
  componentWillMount () {
    var {dispatch, coaches} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
    }
  },

  render() {
    var {selection, centres} = this.props;
    var centre;
    centres.map((c) => {
      if(c.id === selection) {
        centre = c;
      }
    });
    var calendars = centre.calendars;
    var termDates = [];
    var count=0;
    Object.keys(calendars).forEach((calendarKey)=> {
      var terms = calendars[calendarKey].term
      Object.keys(terms).forEach((termID) => {
        var term = terms[termID];
        Object.keys(term).forEach((dateID) => {
          var date = term[dateID];
          if (moment(date).isAfter() && count<8) {
            termDates.push({
              term: termID,
              session: parseInt(dateID)+1,
              date,
              calendarKey
            });
            count++;
          }
        })
      })
    })
    var termDates = _.orderBy(termDates, ['term', 'session'], ['asc', 'asc']);

    var html = [];
    termDates.map((dateInfo) => {
        html.push(<TermButton key={dateInfo.date} title={"T"+dateInfo.term+"-S"+dateInfo.session} date={moment(dateInfo.date).format('D MMM')} />)
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
});

 export default connect((state) => {return state;
})(ScheduleApp);
