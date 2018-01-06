import React from 'react';
import {connect} from 'react-redux'
import { Row, Col, Glyphicon } from 'react-bootstrap';
import { updateAttendance } from 'actions';
import { Link } from 'react-router';
import truncate from 'lodash/truncate'
import moment from 'moment';
import Switch from 'Switch';
import { attendedDate, paidDate, getTermByDate, getCalendarKey } from 'helper';

class Attendee extends React.Component {
  render() {
    var { dispatch, date, type, calendars, selection } = this.props;
    var {
      childName,
      key,
      attendance,
      payments,
      status,
      ageGroup
    } = this.props.student;
    date = moment(date).format('YYYY-MM-DD');
    var truncatedName = truncate(childName, {
      length: 28
    });
    var attended = attendedDate(attendance, date);
    var calendarKey = getCalendarKey(
      this.props.student,
      selection.classes,
      ageGroup
    );
    var termId = getTermByDate(calendars[calendarKey], date);
    var paid = paidDate(payments, date, termId, moment(date).year());
    var backgroundColor;
    if (type === 'normal') {
      backgroundColor = 'none';
    } else if (type === 'makeup') {
      backgroundColor = '#ffecb9';
    } else if (type === 'makeUpFrom') {
      backgroundColor = '#ffbed0';
    }

    return (
      <Row
        key={key}
        style={{
          padding: '8px 10px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center',
          backgroundColor
        }}
      >
        <Col xs={2} md={2}>
          <Switch
            name={key + 'attended' + date}
            checked={attended}
            onChange={() => {
              dispatch(updateAttendance(date, key));
            }}
          />
        </Col>
        <Col
          xs={6}
          md={6}
          style={{ fontSize: '14px', color: paid ? '#656565' : 'red' }}
        >
          <Glyphicon glyph="user" /> {truncatedName}
        </Col>
        <Col xs={4} md={4} style={{ textAlign: 'right' }}>
          {type === 'makeup'
            ? null
            : <Link to={'/m/attendance/makeup/' + key}>
                <button className="innerbtn">Make Up</button>
              </Link>}
          <Link to={'/m/attendance/history/' + key}>
            <button className="innerbtn">
              <Glyphicon glyph="chevron-right" />{' '}
            </button>
          </Link>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    selection: state.selection,
    calendars: state.calendars
  };
}
export default connect(mapStateToProps)(Attendee);
