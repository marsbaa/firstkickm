import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import Switch from 'Switch';

const CancelClassItem = ({
  name,
  handleChange,
  paidStudents,
  attendedStudents,
  classCancelled
}) => {
  return (
    <Row
      style={{
        padding: '8px 10px',
        borderBottom: '1px solid #cccccc',
        backgroundColor: classCancelled ? 'pink' : 'white'
      }}
    >
      <Col xs={2} md={2} lg={2}>
        {classCancelled
          ? <div>Cancelled</div>
          : <Switch
              name={name}
              onChange={() => handleChange()}
              disabled={attendedStudents > 0 ? true : false}
            />}
      </Col>
      <Col xs={7} md={7} lg={7}>
        {name}{' '}
      </Col>
      <Col xs={1} md={1} lg={1}>
        {paidStudents > 0
          ? <Badge style={{ backgroundColor: 'orange' }}>
              P: {paidStudents}
            </Badge>
          : null}
      </Col>
      <Col xs={1} md={1} lg={1}>
        {attendedStudents > 0
          ? <Badge style={{ backgroundColor: 'green' }}>
              A: {attendedStudents}
            </Badge>
          : null}
      </Col>
      <Col xs={1} md={1} lg={1} />
    </Row>
  );
};

export default CancelClassItem;
