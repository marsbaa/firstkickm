import React from 'react';
import { Row, Col } from 'react-bootstrap';

const ListHeader = props => {
  const { title, button } = props;
  return (
    <Row
      style={{
        backgroundColor: '#656565',
        padding: '5px 10px',
        display: 'flex',
        alignItems: 'center',
        color: '#ffc600'
      }}
    >
      <Col xs={8} md={8} lg={8}>
        <h5>
          {title}
        </h5>
      </Col>
      <Col xs={4} md={4} lg={8}>
        {button}
      </Col>
    </Row>
  );
};

export default ListHeader;
