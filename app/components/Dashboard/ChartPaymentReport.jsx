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
  let totalStudents = 0, totalPaid = 0, totalUnPaid = 0;
  Object.keys(centres).map(centreKey => {
    let studentsPaid = 0, paidTotal = 0, studentsUnPaid = 0;
    const centre = centres[centreKey];
    const classes = centre.classes;
    Object.keys(classes).forEach(classKey => {
      const { day, startTime, endTime, ageGroup, calendarKey } = classes[
        classKey
      ];
      const classTime = startTime + ' - ' + endTime;

      //Get TermDates
      const calendar = _.find(calendars, { key: calendarKey });
      let termDates = [];
      calendar.terms[selectedTerm].map(date => {
        termDates.push(date);
      });
      //Filter Students on Centre
      let filteredStudents = filter(students, {
        venueId: centre.id,
        currentClassDay: day,
        currentClassTime: classTime,
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
    totalStudents += studentsPaid + studentsUnPaid;
    totalPaid += paidTotal;
    totalUnPaid += studentsUnPaid;
    data.push({
      name: centre.name,
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
          <h5>Students: {totalStudents}</h5>
        </Col>
        <Col xs={4} md={4} lg={4}>
          <h5>Collected: ${totalPaid}</h5>
        </Col>
        <Col xs={4} md={4} lg={4}>
          <h5>
            Unpaid: ${Math.round(totalUnPaid * avgPaid)}
          </h5>
        </Col>
      </Row>
      <ResponsiveContainer minWidth={300} aspect={1}>
        <BarChart
          layout="vertical"
          width={600}
          height={600}
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <CartesianGrid />
          <Tooltip />
          <Legend />
          <Bar dataKey="paid" stackId="a" fill="#8884d8" />
          <Bar dataKey="unpaid" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartPaymentReport;
