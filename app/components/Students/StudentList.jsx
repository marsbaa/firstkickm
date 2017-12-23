import React from 'react';
import size from 'lodash/size';
import Student from 'Student';
import { Row, Col } from 'react-bootstrap';

const StudentList = ({ title, classStudents }) => {
  return (
    <div key={title}>
      <Row
        style={{
          backgroundColor: '#656565',
          padding: '0px 15px',
          color: '#ffc600'
        }}
      >
        <Col xs={8} md={8}>
          <h5>
            {title}
          </h5>
        </Col>
        <Col xs={4} md={4} style={{ textAlign: 'center' }}>
          <h5>
            Class Size : {size(classStudents)}
          </h5>
        </Col>
      </Row>
      {Object.keys(classStudents).map(studentId => {
        var student = classStudents[studentId];
        return <Student key={student.key} student={student} />;
      })}
    </div>
  );
};

export default StudentList;
