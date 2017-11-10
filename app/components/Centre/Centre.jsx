import React from 'react';
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
  Glyphicon,
  Image
} from 'react-bootstrap';
import capitalize from 'lodash/capitalize';
import { Link } from 'react-router';

const Centre = ({ centre }) => {
  return (
    <Row
      style={{
        padding: '8px 10px',
        borderBottom: '1px solid #cccccc',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Col xs={9} md={9} style={{ fontSize: '14px' }}>
        <img src={centre.logoURL} style={{ height: '25px' }} /> {centre.id}.{' '}
        {capitalize(centre.name)}
      </Col>
      <Col xs={3} md={3} style={{ textAlign: 'right' }}>
        <Link to={'/m/centres/' + centre.key}>
          <button className="innerbtn">
            <Glyphicon glyph="chevron-right" />{' '}
          </button>
        </Link>
      </Col>
    </Row>
  );
};

export default Centre;
