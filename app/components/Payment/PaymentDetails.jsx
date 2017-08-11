import React from 'react';
import _ from 'lodash';
import { ListGroup, ListGroupItem, Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
var actions = require('actions');
import { connect } from 'react-redux';

class PaymentDetails extends React.Component {
  render() {
    const { centres } = this.props;
    const {
      termsPaid,
      key,
      earlyBird,
      earlyBirdAmount,
      siblingDiscount,
      siblingDiscountAmount,
      promotionDiscount,
      promotionDiscountAmount,
      registration,
      registrationAmount,
      total,
      coachDiscount,
      prorate,
      centreId
    } = this.props.payment;
    const centre = _.find(centres, { id: centreId });
    let termspaidhtml = [];
    let termsamounthtml = [];
    let paidSessions = 0;
    let cost = 0;

    if (termsPaid !== undefined) {
      Object.keys(termsPaid).map(termId => {
        paidSessions += termsPaid[termId].length;
      });
      Object.keys(termsPaid).map(termId => {
        termspaidhtml.push(
          <Button
            style={{
              padding: '2px',
              fontSize: '8px',
              backgroundColor: '#ffc600',
              color: '#656565'
            }}
            key={key + termId}
            bsSize="xsmall"
          >
            T{termId}
            <Glyphicon glyph="ok" />
          </Button>
        );

        let term = termsPaid[termId];
        switch (size(term)) {
          case 8:
            cost = 300;
            break;
          case 7:
            cost = 270;
            break;
          case 6:
            cost = 240;
            break;
          case 5:
            cost = 220;
            break;
          default:
            cost = term.length * (paidSessions > 8 ? 35 : 45);
            break;
        }

        termsamounthtml.push(
          <p key={'amount' + termId} style={{ margin: '0px' }}>
            Term {termId} Fees : ${cost}
          </p>
        );
      });
    }

    return (
      <ListGroup fill>
        <ListGroupItem>
          Centre : {centre.name}
        </ListGroupItem>
        {isEmpty(termspaidhtml)
          ? null
          : <ListGroupItem>
              Terms Paid : {termspaidhtml}
            </ListGroupItem>}
        {termsPaid !== undefined
          ? <ListGroupItem>
              {Object.keys(termsPaid).map(termId => {
                const term = termsPaid[termId];
                return (
                  <p
                    key={'TermDates' + termId}
                    style={{ fontSize: '9px', margin: '0px' }}
                  >
                    T{termId} ({size(term)} sessions):{' '}
                    {term.map((date, index) => {
                      return index < size(term) - 1
                        ? <i key={date.date}>
                            {moment(date.date).format('DD MMM YYYY')},{' '}
                          </i>
                        : <i key={date.date}>
                            {moment(date.date).format('DD MMM YYYY')}
                          </i>;
                    })}
                  </p>
                );
              })}
            </ListGroupItem>
          : ''}
        {isEmpty(termsamounthtml)
          ? null
          : <ListGroupItem>
              {termsamounthtml}
            </ListGroupItem>}
        {coachDiscount !== false && coachDiscount !== undefined
          ? <ListGroupItem>
              Coach Discount: (${cost * 0.5})
            </ListGroupItem>
          : null}
        {earlyBird
          ? <ListGroupItem>
              Early Bird: (${earlyBirdAmount === undefined
                ? 20
                : earlyBirdAmount})
            </ListGroupItem>
          : null}
        {registration
          ? <ListGroupItem>
              Registration: ${registrationAmount === undefined
                ? 80
                : registrationAmount}
            </ListGroupItem>
          : null}
        {prorate !== undefined && prorate !== null
          ? <ListGroupItem>
              Pro-rate: (${prorate})
            </ListGroupItem>
          : null}
        {siblingDiscount
          ? <ListGroupItem>
              Sibling Discount: (${siblingDiscountAmount})
            </ListGroupItem>
          : null}
        {promotionDiscount !== undefined
          ? <ListGroupItem>
              {promotionDiscount}: (${promotionDiscountAmount})
            </ListGroupItem>
          : null}
        <ListGroupItem>
          Total : ${total}
        </ListGroupItem>
      </ListGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    centres: state.centres
  };
}

export default connect(mapStateToProps)(PaymentDetails);
