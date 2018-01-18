import React from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

const ChildPayTerm = props => {
  const { termId, dates, termFee } = props;
  return (
    <Row
      style={{
        padding: '0px 15px',
        marginTop: '5px',
        lineHeight: '12px'
      }}
    >
      <Col xs={8} md={8}>
        <b>Term {termId}</b> ({dates.length} sessions)
      </Col>
      <Col xs={4} md={4} style={{ textAlign: 'right' }}>
        ${termFee}
      </Col>
      <Col xs={12} md={12} style={{ marginTop: '0px' }}>
        {dates.map((date, dateId) => {
          if (dateId === 0) {
            return (
              <font key={termId+date} style={{ fontSize: '9px' }}>
                <i>
                  {moment(date).format('D MMM')}
                </i>
              </font>
            );
          } else {
            return (
              <font key={date} style={{ fontSize: '9px' }}>
                <i>
                  , {moment(date).format('D MMM')}
                </i>
              </font>
            );
          }
        })}
      </Col>
    </Row>
  );
};
export default ChildPayTerm;
