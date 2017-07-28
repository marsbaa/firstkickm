import React from 'react';
import { Row, Col } from 'react-bootstrap';

const ListContent = props => {
  const { contentLeft, contentRight } = props;
  return (
    <Row
      style={{
        padding: '8px 10px',
        borderBottom: '1px solid #cccccc',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Col xs={8} md={8} style={{ fontSize: '14px' }}>
        {contentLeft}
      </Col>
      <Col xs={4} md={4} style={{ textAlign: 'right' }}>
        {contentRight}
      </Col>
    </Row>
  );
};

export default ListContent;
