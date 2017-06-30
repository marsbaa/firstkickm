import React from 'react';
import _ from 'lodash';
var { connect } = require('react-redux');
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from 'moment';
import { Glyphicon } from 'react-bootstrap';
import StudentsFilter from 'StudentsFilter';
import { Link } from 'react-router';
import { getActive, paidDate } from 'helper';
import filter from 'lodash/filter';
import size from 'lodash/size';

class AttendanceTable extends React.Component {
  render() {
    const { calendars, students, selection, selectedTerm } = this.props;
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
    let data = [];
    let termColumns = termDates.map((date, id) => {
      return {
        header: (
          <b style={{ fontSize: '9px' }}>{moment(date).format('DD/MM')}</b>
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

    Object.keys(filteredActiveStudents).map(studentId => {
      var termData = [];
      var { payments, attendance, childName, key } = filteredActiveStudents[
        studentId
      ];
      termDates.map(date => {
        var dateId = moment(date).format('YYYY-MM-DD');
        var attended = '';
        var paid = paidDate(payments, dateId, selectedTerm);
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
              backgroundColor: paid ? 'green' : 'none',
              textAlign: 'center',
              color: 'white',
              fontSize: '9px'
            }}
          >
            {attended === 'attended'
              ? <Glyphicon
                  glyph="ok"
                  style={{ color: !paid ? 'red' : 'white' }}
                />
              : attended === 'notattended'
                  ? <Glyphicon glyph="remove" />
                  : <Glyphicon glyph="minus" />}
          </div>
        );
      });
      data.push({
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

    const columns = [
      {
        header: <b style={{ fontSize: '14px' }}>{headerTitle}</b>,
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
        <ReactTable
          showPagination={false}
          data={data}
          resizable={false}
          columns={columns}
          pageSize={size(filteredActiveStudents)}
        />
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(AttendanceTable);
