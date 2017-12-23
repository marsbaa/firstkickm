import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Glyphicon, Label } from 'react-bootstrap';
import find from 'lodash/find';
import {
  getTerm,
  getCalendarKey,
  paidDate,
  paidTerm,
  attendedDate
} from 'helper';
import moment from 'moment';

class AttendanceHistory extends React.Component {
  render() {
    const { student, selection, calendars } = this.props;
    const termId = getTerm(calendars, selection.key, moment().format());
    const terms = calendars[getCalendarKey(student, selection.classes)].terms;
    let html = [];
    if (student.payments !== undefined) {
      for (var i = termId; i > 0; i--) {
        const term = terms[i];
        if (paidTerm(student.payments, i)) {
          html.push(
            <Row key={i} style={{ marginTop: '20px' }}>
              <Col xs={12} md={12} lg={12}>
                <p style={{ textDecoration: 'underline', marginBottom: '5px' }}>
                  Term {i}
                </p>
                <div>
                  {term.map(date => {
                    const paid = paidDate(student.payments, date, termId);
                    const attended = attendedDate(student.attendance, date);
                    return (
                      <Label
                        style={{
                          backgroundColor: paid ? '#27ae60' : '#e74c3c',
                          fontSize: '12px',
                          float: 'left',
                          width: '22%',
                          margin: '2px'
                        }}
                        key={date}
                      >
                        {moment(date).format('DD MMM')}
                        {attended
                          ? <Glyphicon glyph="ok" />
                          : <Glyphicon glyph="minus" />}
                      </Label>
                    );
                  })}
                </div>
              </Col>
            </Row>
          );
        }
      }
    }

    return (
      <div>
        <Row
          style={{
            backgroundColor: '#656565',
            padding: '0px 15px',
            color: '#ffc600'
          }}
        >
          <Col xs={12} md={12} lg={12}>
            <h5>
              {student.childName} (Attendance {moment().format('YYYY')})
            </h5>
          </Col>
        </Row>
        <div style={{ padding: '0px 15px' }}>
          {html}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    student: find(state.students, { key: props.params.studentId }),
    selection: state.selection,
    calendars: state.calendars
  };
}
export default connect(mapStateToProps)(AttendanceHistory);
