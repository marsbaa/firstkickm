import React from 'react';
import { Tab } from 'react-bootstrap';
import PaymentChildForm from 'PaymentChildForm';

const PaymentChildTab= props => {
  const { eventKey, title, payerKey } = props;
  return (
    <Tab eventKey={eventKey} title={title}>
      <PaymentChildForm payerKey={payerKey} />
    </Tab>
  );
};

export default PaymentChildTab;