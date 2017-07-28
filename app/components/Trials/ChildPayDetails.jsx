import React from 'react';
import { Grid, Glyphicon, Row, Col } from 'react-bootstrap';
import ChildPayTerm from 'ChildPayTerm';
import { getTotalSessions } from 'helper';

const ChildPayDetails = props => {
  const { childName, termFee, sessionDates } = props;
  return (
    <div>
      <Row
        key={'Name' + childName}
        style={{ padding: '0px 15px', marginTop: '15px' }}
      >
        <Col
          xs={12}
          md={12}
          lg={12}
          style={{ borderBottom: '1px solid #bcbcbc' }}
        >
          <p style={{ fontWeight: '800', marginBottom: '0px' }}>
            <Glyphicon glyph="user" /> {childName}
          </p>
        </Col>
      </Row>
      {Object.keys(sessionDates).map(termId => {
        const dates = sessionDates[termId];
        return (
          <ChildPayTerm
            key={childName + termId}
            termId={termId}
            dates={dates}
            termFee={termFee[termId]}
          />
        );
      })}
    </div>
  );
};

export default ChildPayDetails;
