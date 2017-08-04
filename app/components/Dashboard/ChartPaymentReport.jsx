import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Text
} from 'recharts';
import { findPaymentDetails } from 'helper';
import size from 'lodash/size';
import filter from 'lodash/filter';

const ChartPaymentReport = props => {
  const { calendars, students, selectedTerm, centres } = props;
  let data = [];
  let totalStudents = 0,
    totalPaid = 0,
    totalUnPaid = 0;
  Object.keys(centres).map(centreKey => {
    const { name, id, classes } = centres[centreKey];

    const centreCalendars = _.filter(calendars, { centreKey: centreKey });

    let studentsPaid = 0,
      paidTotal = 0,
      studentsUnPaid = 0;
    Object.keys(centreCalendars).map(calendarId => {
      const { terms, key } = centreCalendars[calendarId];
      //Get TermDates from Calendar
      let termDates = [];
      if (terms[selectedTerm] !== undefined) {
        terms[selectedTerm].map(date => {
          termDates.push(date);
        });
      }
      //Filter Students by centre
      const clas = filter(classes, { calendarKey: key });
      clas.map(c => {
        const { day, ageGroup, startTime, endTime } = c;
        const classTime = startTime + ' - ' + endTime;

        let filteredStudents = filter(students, {
          venueId: id,
          currentClassTime: classTime,
          currentClassDay: day,
          ageGroup: ageGroup
        });

        const { paid, paidAmount, unpaid } = findPaymentDetails(
          filteredStudents,
          termDates,
          selectedTerm
        );

        studentsPaid += size(paid);
        paidTotal += paidAmount;
        studentsUnPaid += size(unpaid);
      });
    });
    totalStudents += studentsPaid + studentsUnPaid;
    totalPaid += paidTotal;
    totalUnPaid += studentsUnPaid;
    data.push({
      name,
      paid: studentsPaid,
      unpaid: studentsUnPaid
    });
  });
  const avgPaid = totalPaid / totalStudents;

  return (
    <div>
      <Row
        style={{
          backgroundColor: '#656565',
          padding: '0px 15px',
          color: '#ffc600'
        }}
      >
        <Col xs={4} md={4} lg={4}>
          <h5>
            Students: {totalStudents}
          </h5>
        </Col>
        <Col xs={4} md={4} lg={4}>
          <h5>
            Collected: ${totalPaid}
          </h5>
        </Col>
        <Col xs={4} md={4} lg={4}>
          <h5>
            Unpaid: ${Math.round(totalUnPaid * avgPaid)}
          </h5>
        </Col>
      </Row>
      <ResponsiveContainer minWidth={300} height="80%">
        <BarChart
          layout="vertical"
          width={600}
          height={400}
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <CartesianGrid />
          <Tooltip />
          <Legend />
          <Bar dataKey="paid" stackId="a" fill="#bed499" />
          <Bar dataKey="unpaid" stackId="a" fill="#cf6362" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartPaymentReport;
