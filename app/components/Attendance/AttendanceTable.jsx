import React from 'react';
import _ from 'lodash';
var { connect } = require('react-redux');
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';
import { Glyphicon, Row, Col } from 'react-bootstrap';
import StudentsFilter from 'StudentsFilter';
import { Link } from 'react-router';
import { getActive, paidDate, findPaymentDetails, makeUpDate } from 'helper';
import filter from 'lodash/filter';
import size from 'lodash/size';

class AttendanceTable extends React.Component {
  render() {
    const {
      calendars,
      students,
      selection,
      selectedTerm,
      makeUps
    } = this.props;
    const {
      day,
      startTime,
      endTime,
      ageGroup,
      calendarKey
    } = this.props.classes;

    const headerTitle =
      ageGroup + ' ' + _.capitalize(day) + ' ' + startTime + ' - ' + endTime;
    const classTime = startTime + ' - ' + endTime;
    const calendar = _.find(calendars, { key: calendarKey });
    let termDates = [];
    calendar.terms[selectedTerm].map(date => {
      termDates.push(date);
    });
    let dataPaid = [];
    let dataUnPaid = [];
    let termColumns = termDates.map((date, id) => {
      return {
        header: (
          <b style={{ fontSize: '9px' }}>
            {moment(date).format('DD/MM')}
          </b>
        ),
        accessor: 'status[' + id + ']',
        maxWidth: 35
      };
    });
    let filteredStudents = StudentsFilter.filter(students, selection.id, '');
    let activeStudents = getActive(filteredStudents);
    let filteredActiveStudents = filter(activeStudents, {
      ageGroup: ageGroup,
      currentClassDay: day,
      currentClassTime: classTime
    });

    const { paid, paidAmount, paidDetails, unpaid } = findPaymentDetails(
      filteredActiveStudents,
      termDates,
      selectedTerm
    );

    Object.keys(paid).map(studentId => {
      let termData = [];
      const { payments, attendance, childName, key } = paid[studentId];
      termDates.map(date => {
        const dateId = moment(date).format('YYYY-MM-DD');
        let attended = '';

        const paid = paidDate(payments, dateId, selectedTerm);

        const filteredMakeUps = _.filter(makeUps, { studentKey: key });
        const { to, from } = makeUpDate(filteredMakeUps, dateId);

        if (attendance !== undefined) {
          if (attendance[dateId] !== undefined) {
            if (attendance[dateId].attended) {
              attended = 'attended';
            }
          }
        }
        if (moment().isAfter(dateId)) {
          if (paid & (attended !== 'attended')) {
            attended = 'notattended';
          }
        }
        termData.push(
          <div
            style={{
              width: '100%',
              height: '15px',
              backgroundColor: from ? 'blue' : paid ? 'green' : 'none',
              textAlign: 'center',
              color: 'white',
              fontSize: '9px'
            }}
          >
            {attended === 'attended'
              ? <Glyphicon
                  glyph="ok"
                  style={{ color: to ? 'blue' : !paid ? 'red' : 'white' }}
                />
              : attended === 'notattended'
                ? <Glyphicon glyph="remove" />
                : <Glyphicon glyph="minus" />}
          </div>
        );
      });
      dataPaid.push({
        childName: (
          <Link to={'/m/students/edit/' + key}>
            {childName}
          </Link>
        ),
        paymentButton: (
          <Link
            className="innerbtn"
            style={{ fontSize: '7px' }}
            to={'/m/payment/collection/' + key}
          >
            $
          </Link>
        ),
        status: termData
      });
    });

    const columnsPaid = [
      {
        header: <b style={{ fontSize: '14px' }}>Paid</b>,
        columns: [
          {
            header: <b style={{ fontSize: '11px' }}>Child Name</b>,
            accessor: 'childName',
            maxWidth: 80,
            style: { fontSize: '11px' }
          },
          {
            header: <b style={{ fontSize: '9px' }}>P</b>,
            accessor: 'paymentButton',
            maxWidth: 30,
            style: { fontSize: '11px' }
          },
          ...termColumns
        ]
      }
    ];

    Object.keys(unpaid).map(studentId => {
      let termData = [];
      const { payments, attendance, childName, key } = unpaid[studentId];
      termDates.map(date => {
        const dateId = moment(date).format('YYYY-MM-DD');
        let attended = '';
        const paid = paidDate(payments, dateId, selectedTerm);
        if (attendance !== undefined) {
          if (attendance[dateId] !== undefined) {
            if (attendance[dateId].attended) {
              attended = 'attended';
            }
          }
        }
        if (moment().isAfter(dateId)) {
          if (paid & (attended !== 'attended')) {
            attended = 'notattended';
          }
        }
        const filteredMakeUps = _.filter(makeUps, { studentKey: key });
        const { to, from } = makeUpDate(filteredMakeUps, dateId);
        termData.push(
          <div
            style={{
              width: '100%',
              height: '15px',
              backgroundColor: 'none',
              textAlign: 'center',
              color: 'white',
              fontSize: '9px'
            }}
          >
            {attended === 'attended'
              ? <Glyphicon glyph="ok" style={{ color: to ? 'blue' : 'red' }} />
              : <Glyphicon glyph="minus" />}
          </div>
        );
      });
      dataUnPaid.push({
        childName: (
          <Link to={'/m/students/edit/' + key}>
            {childName}
          </Link>
        ),
        paymentButton: (
          <Link
            className="innerbtn"
            style={{ fontSize: '7px' }}
            to={'/m/payment/collection/' + key}
          >
            $
          </Link>
        ),
        status: termData
      });
    });

    const columnsUnPaid = [
      {
        header: <b style={{ fontSize: '14px' }}>Not Paid</b>,
        columns: [
          {
            header: <b style={{ fontSize: '11px' }}>Child Name</b>,
            accessor: 'childName',
            maxWidth: 80,
            style: { fontSize: '11px' }
          },
          {
            header: <b style={{ fontSize: '9px' }}>P</b>,
            accessor: 'paymentButton',
            maxWidth: 30,
            style: { fontSize: '11px' }
          },
          ...termColumns
        ]
      }
    ];

    return (
      <div>
        <Row
          key={headerTitle}
          style={{
            backgroundColor: '#656565',
            textAlign: 'center',
            color: '#ffc600'
          }}
        >
          <Col xs={12} md={12} lg={12}>
            <h5>
              {headerTitle}
            </h5>
          </Col>
        </Row>
        <ReactTable
          showPagination={false}
          data={dataPaid}
          resizable={false}
          columns={columnsPaid}
          pageSize={size(paid)}
        />
        <ReactTable
          showPagination={false}
          data={dataUnPaid}
          resizable={false}
          columns={columnsUnPaid}
          pageSize={size(unpaid)}
        />
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(AttendanceTable);
