import React from 'react';
import { Tab } from 'react-bootstrap';
import ChildPayForm from 'ChildPayForm';

const ChildPayTab = props => {
  const { eventKey, title, payerKey } = props;
  return (
    <Tab eventKey={eventKey} title={title}>
      <ChildPayForm payerKey={payerKey} />
    </Tab>
  );
};

export default ChildPayTab;
