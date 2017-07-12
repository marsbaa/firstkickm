import React from 'react';
import { Row, Col } from 'react-bootstrap';

const ListHeader = props => {
  const { title } = props;
  return (
    <Row
      style={{
        backgroundColor: '#656565',
        padding: '0px 15px',
        color: '#ffc600'
      }}
    >
      <Col xs={8} md={8}>
        <h5>{title}</h5>
      </Col>
      <Col xs={4} md={4} />
    </Row>
  );
};

export default ListHeader;
