import React from 'react';
import { Tab } from 'react-bootstrap';
import TrialRegChildPanel from 'TrialRegChildPanel';

const TrialRegChildTab = props => {
  const { eventKey, title, id } = props;
  return (
    <Tab eventKey={eventKey} title={title}>
      <TrialRegChildPanel id={id} />
    </Tab>
  );
};

export default TrialRegChildTab;
