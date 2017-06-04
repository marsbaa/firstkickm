import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Glyphicon, Grid, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import truncate from 'lodash/truncate';

const PayerNotPaid = ({ props }) => {
  const { childName, key, gender, payments, email, contact } = props.student;
  var truncatedName = _.truncate(childName, {
    length: 28
  });

  return (
    <Grid>
      <Row style={{ padding: '8px 5px', borderBottom: '1px solid #9a9a9a' }}>
        <Col
          xs={7}
          md={7}
          lg={7}
          style={{ fontSize: '14px', marginTop: '8px' }}
        >
          <Link
            to={'/m/students/edit/' + key}
            style={{ color: 'black', marginRight: '4px' }}
          >
            <Glyphicon
              style={{ marginRight: '4px', fontSize: '14px' }}
              glyph="user"
            />
            <font className={gender}>{truncatedName}</font>
          </Link>
        </Col>
        <Col xs={5} md={5} lg={5} style={{ textAlign: 'right' }}>
          <FormControl
            style={{ fontSize: '12px', textAlign: 'center' }}
            id="mobile"
            type="text"
            placeholder="Enter mobile"
            defaultValue={contact}
            disabled
          />
        </Col>
      </Row>
    </Grid>
  );
};

export default PayerNotPaid;
