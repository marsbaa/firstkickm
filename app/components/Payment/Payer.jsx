import React from 'react';
import { Row, Col, Glyphicon, Grid, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import union from 'lodash/union';
import uniq from 'lodash/uniq';
import truncate from 'lodash/truncate';
import moment from 'moment';

const Payer = props => {
  const { childName, key, gender, payments, email } = props.student;
  let truncatedName = truncate(childName, {
    length: 28
  });
  let termsPaidHTML = [];
  let terms = [];
  if (payments !== undefined) {
    Object.keys(payments).map(paymentId => {
      const { termsPaid, date } = payments[paymentId];
      if (moment().year(date, 'year')) {
        if (termsPaid !== undefined) {
          terms = union(terms, Object.keys(termsPaid));
        }
      }
    });
    terms = uniq(terms);
    terms.map(termId => {
      termsPaidHTML.push(
        <Badge
          key={key + termId}
          style={{
            fontSize: '8px',
            backgroundColor: '#f5bb05',
            color: 'black'
          }}
        >
          T{termId}
        </Badge>
      );
    });
  }

  return (
    <Grid>
      <Row style={{ padding: '8px 5px', borderBottom: '1px solid #9a9a9a' }}>
        <Col xs={7} md={7} lg={7} style={{ fontSize: '14px' }}>
          <Link
            to={'/m/students/edit/' + key}
            style={{ color: 'black', marginRight: '4px' }}
          >
            <Glyphicon
              style={{ marginRight: '4px', fontSize: '12px' }}
              glyph="user"
            />
            <font className={gender}>
              {truncatedName}
            </font>
          </Link>
          {termsPaidHTML}
        </Col>
        <Col xs={5} md={5} lg={5} style={{ textAlign: 'right' }}>
          <button
            className="innerbtn"
            onClick={e => props.onShow(e, key, childName, email)}
          >
            <Glyphicon glyph="shopping-cart" />{' '}
          </button>
          <Link to={'/m/payment/collection/' + key}>
            <button className="innerbtn">
              <Glyphicon glyph="usd" />{' '}
            </button>
          </Link>
          <Link to={'/m/payment/history/' + key}>
            <button className="innerbtn">
              <Glyphicon glyph="list-alt" />{' '}
            </button>
          </Link>
        </Col>
      </Row>
    </Grid>
  );
};

export default Payer;
