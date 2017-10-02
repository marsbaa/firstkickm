import ReactDomServer from 'react-dom/server';
import React from 'react';
import { Grid, Row, Col, Image, Table, Well } from 'react-bootstrap';
import moment from 'moment';
import size from 'lodash/size';

module.exports = {
  render: function(paymentDetails) {
    var html = ReactDomServer.renderToStaticMarkup(
      React.createElement(Root, paymentDetails)
    );
    return html;
  }
};

class Root extends React.Component {
  render() {
    const paymentDetails = this.props;
    let html = [];
    let chequeHTML = [];
    let receiptDate =
      paymentDetails[0].date === undefined
        ? moment().format('D MMM YYYY')
        : moment(paymentDetails[0].date).format('D MMM YYYY');
    let paymentMethod = paymentDetails[0].paymentMethod;
    if (paymentMethod === 'Cheque') {
      paymentMethod = paymentMethod + ' #' + paymentDetails[0].chequeNumber;
      chequeHTML.push(
        <i key="chequehtml" style={{ fontSize: '10px' }}>
          Note: Receipt will only be valid if cheque is cleared by bank
        </i>
      );
    }
    if (paymentMethod === 'NETS') {
      paymentMethod = paymentMethod + ' #' + paymentDetails[0].refNumber;
    }
    let grandTotal = 0;
    Object.keys(paymentDetails).forEach(id => {
      const {
        childKey,
        childName,
        termsPaid,
        registration,
        siblingDiscount,
        siblingDiscountAmount,
        earlyBird,
        earlyBirdAmount,
        registrationAmount,
        promotionDiscount,
        promotionDiscountAmount,
        coachDiscount,
        prorate,
        credit,
        total
      } = this.props[id];

      html.push(
        <Row key={childKey} style={{ marginLeft: '30px' }}>
          <Col xs={8} md={8}>
            <p style={{ fontWeight: '800', textDecoration: 'underline' }}>
              {childName}
            </p>
          </Col>
        </Row>
      );
      let cost = 0;
      let paidSessions = 0;
      Object.keys(termsPaid).map(termId => {
        paidSessions += size(termsPaid[termId]);
      });
      Object.keys(termsPaid).map(termId => {
        const term = termsPaid[termId];
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
            cost = size(term) * (paidSessions > 8 ? 35 : 45);
            break;
        }
        var datehtml = [];
        term.map((date, dateId) => {
          if (dateId === 0) {
            datehtml.push(
              <font key={date.date} style={{ fontSize: '9px' }}>
                {moment(date.date).format('D MMM')}
              </font>
            );
          } else {
            datehtml.push(
              <font key={date.date} style={{ fontSize: '9px' }}>
                , {moment(date.date).format('D MMM')}
              </font>
            );
          }
        });
        html.push(
          <Row
            key={'Term' + childName + termId}
            style={{ lineHeight: '12px', margin: '5px 30px' }}
          >
            <Col xs={8} md={8}>
              <b>Term {termId}</b> ({term.length} sessions)
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              ${cost}
            </Col>
            <Col xs={8} md={8} style={{ marginTop: '0px' }}>
              {datehtml}
            </Col>
            <Col xs={4} md={4} />
          </Row>
        );
      });
      if (registration) {
        html.push(
          <Row
            key={'registration' + childName}
            style={{ lineHeight: '12px', margin: '15px 30px' }}
          >
            <Col xs={8} md={8}>
              <b>Registration Fee</b>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              ${registrationAmount === undefined ? 80 : registrationAmount}
            </Col>
          </Row>
        );
      }
      if (coachDiscount) {
        html.push(
          <Row
            key={'coachDiscount' + childName}
            style={{ lineHeight: '12px', margin: '15px 30px' }}
          >
            <Col xs={8} md={8}>
              <b style={{ color: '#1796d3' }}>Coach Discount</b>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              $({cost * 0.5})
            </Col>
          </Row>
        );
      }
      if (earlyBird) {
        html.push(
          <Row
            key={'early' + childName}
            style={{ lineHeight: '12px', margin: '15px 30px' }}
          >
            <Col xs={8} md={8}>
              <b style={{ color: '#1796d3' }}>Early Bird Discount</b>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              $({earlyBirdAmount === undefined ? '20' : earlyBirdAmount})
            </Col>
          </Row>
        );
      }
      if (credit !== undefined) {
        html.push(
          <Row
            key={'credit' + childName}
            style={{ lineHeight: '12px', margin: '15px 30px' }}
          >
            <Col xs={8} md={8}>
              <b style={{ color: '#1796d3' }}>Credits</b>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              $({credit})
            </Col>
          </Row>
        );
      }
      if (prorate !== undefined && prorate !== null) {
        html.push(
          <Row
            key={'prorate' + childName}
            style={{ lineHeight: '12px', margin: '15px 30px' }}
          >
            <Col xs={8} md={8}>
              <b style={{ color: '#1796d3' }}>Pro-rate</b>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              $({prorate})
            </Col>
          </Row>
        );
      }
      if (siblingDiscount) {
        html.push(
          <Row
            key={'siblingdiscount' + childName}
            style={{ lineHeight: '12px', margin: '15px 30px' }}
          >
            <Col xs={8} md={8}>
              <b style={{ color: '#1796d3' }}>Sibling Discount</b>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              $({siblingDiscountAmount})
            </Col>
          </Row>
        );
      }
      if (promotionDiscount !== undefined) {
        html.push(
          <Row
            key={'promotion' + childName}
            style={{ lineHeight: '12px', margin: '15px 30px' }}
          >
            <Col xs={8} md={8}>
              <b style={{ color: '#1796d3' }}>
                {promotionDiscount}
              </b>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'right' }}>
              $({promotionDiscountAmount})
            </Col>
          </Row>
        );
      }
      grandTotal += total;
    });
    html.push(
      <Row key="total" style={{ lineHeight: '12px', margin: '15px 30px' }}>
        <Col xs={12} md={12}>
          <hr />
        </Col>
        <Col xs={5} md={5} />
        <Col xs={7} md={7} style={{ textAlign: 'right' }}>
          <b style={{ color: '#555', fontSize: '16px', textAlign: 'right' }}>
            Total : ${grandTotal}
          </b>
        </Col>
      </Row>
    );

    return (
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"
          />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css"
          />
          <title>First Kick Academy - Payment Receipt</title>
        </head>
        <body>
          <div style={{ marginTop: '15px' }}>
            <Grid
              style={{
                padding: '20px 30px',
                border: '1px solid #eee',
                color: '#555',
                maxWidth: '600px',
                margin: 'auto',
                boxShadow: '0 0 10px rgba(0, 0, 0, .15)'
              }}
            >
              <Row>
                <Col xs={7} md={7}>
                  <Image
                    src="http://www.fka.sg/wp-content/uploads/2014/11/logo.png"
                    height="60px"
                  />
                </Col>
                <Col
                  xs={5}
                  md={5}
                  style={{ textAlign: 'right', paddingRight: '20px' }}
                >
                  <h4 style={{ marginTop: '10px', marginBottom: '0px' }}>
                    RECEIPT
                  </h4>
                  <font style={{ fontSize: '10px' }}>
                    Date : {receiptDate}
                  </font>
                </Col>
              </Row>
              <Row style={{ marginTop: '30px' }}>
                <Col md={12} xs={12}>
                  <p style={{ paddingLeft: '20px' }}>
                    <b>First Kick Academy</b>
                    <br />
                    1 Orchid Club Road #01-37<br />
                    Orchid Country Club<br />
                    Singapore 769162
                  </p>
                </Col>
              </Row>
              <Row
                style={{
                  margin: '10px 15px',
                  backgroundColor: '#555',
                  paddingLeft: '10px'
                }}
              >
                <Col md={12} xs={12}>
                  <h5
                    style={{
                      color: '#ffffff',
                      fontSize: '15px',
                      padding: '3px 0px'
                    }}
                  >
                    Payment Method
                  </h5>
                </Col>
              </Row>
              <Row style={{ marginLeft: '30px' }}>
                <Col md={12} xs={12}>
                  <p>
                    {paymentMethod}
                    <br />
                    {chequeHTML}
                  </p>
                </Col>
              </Row>
              <Row
                style={{
                  margin: '10px 15px',
                  backgroundColor: '#555',
                  paddingLeft: '10px'
                }}
              >
                <Col md={12} xs={12}>
                  <h5
                    style={{
                      color: '#ffffff',
                      fontSize: '15px',
                      padding: '3px 0px'
                    }}
                  >
                    Fees Breakdown
                  </h5>
                </Col>
              </Row>
              {html}
              <Well style={{ marginTop: '20px', fontSize: '12px' }}>
                <b style={{ textAlign: 'center', fontSize: '14px' }}>
                  Thank you for joining First Kick Academy!
                </b>
                <br />
                <ul style={{ marginTop: '10px' }}>
                  <li>Please keep this receipt for future reference </li>
                  <li>
                    Term Fees are non refundable unless for Long Term Injury (3
                    weeks or more)
                  </li>
                  <li>Term Fees are non transferable</li>
                  <li>
                    If you have not paid for a session but would wish to attend
                    it, please do make a payment of $45 cash to our
                    administrator at the centre.
                  </li>
                  <li>
                    If there are any dispute of the receipt please email to
                    contact@fka.sg
                  </li>
                </ul>
              </Well>
            </Grid>
          </div>
        </body>
      </html>
    );
  }
}
