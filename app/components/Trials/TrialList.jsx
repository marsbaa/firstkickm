import React from 'react';
import { Col, Row } from 'react-bootstrap';

const TrialList = props => {
  return (
    <Row
      key={props.dateId}
      style={{
        backgroundColor: '#656565',
        padding: '0px 15px',
        color: '#ffc600'
      }}
    >
      <Col xs={9} md={9}>
        <h5>{props.dateId}</h5>
      </Col>
      <Col xs={3} md={3} style={{ textAlign: 'center' }}>
        <h5>
          <font style={{ color: 'white' }}>{props.attendedNum}</font>
          {' '}
          /
          {' '}
          {props.trialNum}
        </h5>
      </Col>
    </Row>
  );
};

export default TrialList;
