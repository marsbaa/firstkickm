import React from 'react';
import PayerNotPaid from 'PayerNotPaid';
import { Row, Col } from 'react-bootstrap';

const PaymentClassList = props => {
  return (
    <div>
      <Row
        key={props.title}
        style={{
          backgroundColor: '#656565',
          padding: '0px 15px',
          color: '#ffc600'
        }}
      >
        <Col xs={12} md={12}>
          <h5>{props.title}</h5>
        </Col>
      </Row>
      {Object.keys(props.group).map(id => {
        return (
          <PayerNotPaid key={props.group[id].key} student={props.group[id]} />
        );
      })}
    </div>
  );
};

export default PaymentClassList;
