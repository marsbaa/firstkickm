import React from 'react';
import { Row, Col } from 'react-bootstrap';

const EarlyBird = props => {
  const { amount } = props;
  return (
    <Row style={{ padding: '0px 15px', marginBottom: '5px' }}>
      <Col xs={8} md={8}>
        <b style={{ color: '#1796d3' }}>Early Bird Discount</b>
      </Col>
      <Col xs={4} md={4} style={{ float: 'right' }}>
        <p style={{ textAlign: 'right', marginBottom: '0px' }}>
          (${amount})
        </p>
      </Col>
    </Row>
  );
};

export default EarlyBird;
