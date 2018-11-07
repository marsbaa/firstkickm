import React from 'react';
import { connect } from 'react-redux';
import {updateNavTitle, startPayments} from 'actions'
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Grid,
  Glyphicon,
  FormGroup,
  FormControl
} from 'react-bootstrap';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import size from 'lodash/size'
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'

class TotalCollectionHQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment().month()
    };
    this.handleSelectYear = this.handleSelectYear.bind(this);
    this.handleSelectMonth = this.handleSelectMonth.bind(this);
  }

  componentWillMount() {
    var { dispatch, payments, selection } = this.props;
    dispatch(
      updateNavTitle('/m/totalhq', selection.name + ' Collections')
    );
    if (isEmpty(payments)) {
      dispatch(startPayments());
    }
  }

  handleSelectYear(e) {
    e.preventDefault();
    this.setState({ year: e.target.value });
  }

  handleSelectMonth(e) {
    e.preventDefault();
    this.setState({ month: e.target.value });
  }

  render() {
    var { payments, selection } = this.props;
    var html = [];
    var filteredPayments = filter(payments, p => {
      return (
        moment(p.date).format('MMYYYY') ===
        moment([this.state.year, this.state.month, 1]).format('MMYYYY')
      );
    });
    filteredPayments = filter(filteredPayments, ['centreId', selection.id]);
    var grandTotal = 0;
    if (size(filteredPayments) !== 0) {
      var cashPayments = filter(filteredPayments, ['paymentMethod', 'Cash']);
      if (size(cashPayments) !== 0) {
        var total = 0;
        html.push(
          <Row
            key="cashpayments"
            style={{
              backgroundColor: '#656565',
              padding: '0px 15px',
              color: '#ffc600'
            }}
          >
            <Col xs={12} md={12}>
              <h5>Cash Collections</h5>
            </Col>
          </Row>
        );
        var groupCashPayments = groupBy(cashPayments, function(p) {
          return moment(p.date).format('DD MMM YYYY');
        });
        Object.keys(groupCashPayments).forEach(date => {
          var subTotal = reduce(
            groupCashPayments[date],
            function(sum, n) {
              return sum + n.total;
            },
            0
          );
          html.push(
            <Row
              key={'cash' + date}
              style={{
                backgroundColor: '#f5f5f5',
                padding: '8px 15px',
                borderBottom: '1px solid #cccccc'
              }}
            >
              <Col
                xs={6}
                md={6}
                style={{ fontSize: '14px', fontWeight: '800' }}
              >
                {date}
              </Col>
              <Col xs={6} md={6} style={{ textAlign: 'right' }}>
                Day Cash Total : ${subTotal}
              </Col>
            </Row>
          );
          groupCashPayments[date].map(payment => {
            html.push(
              <Row
                key={payment.key}
                style={{
                  padding: '8px 18px',
                  borderBottom: '1px solid #cccccc'
                }}
              >
                <Col xs={8} md={8} style={{ fontSize: '12px' }}>
                  <Glyphicon glyph="user" /> {payment.childName}
                </Col>
                <Col
                  xs={4}
                  md={4}
                  style={{ textAlign: 'right', fontSize: '12px' }}
                >
                  ${payment.total}
                </Col>
              </Row>
            );
            total += payment.total;
          });
        });
        html.push(
          <Row
            key="totalCashPayment"
            style={{
              padding: '8px 15px',
              borderBottom: '1px solid #cccccc',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Col xs={6} md={6} />
            <Col
              xs={6}
              md={6}
              style={{
                fontWeight: 'bold',
                textAlign: 'right',
                fontSize: '14px'
              }}
            >
              Month Total Cash: ${total}
            </Col>
          </Row>
        );
        grandTotal += total;
      }

      var netsPayments = filter(filteredPayments, ['paymentMethod', 'NETS']);
      if (size(netsPayments) !== 0) {
        var total = 0;
        html.push(
          <Row
            key="netspayments"
            style={{
              backgroundColor: '#656565',
              padding: '0px 15px',
              color: '#ffc600'
            }}
          >
            <Col xs={12} md={12}>
              <h5>NETS Collections</h5>
            </Col>
          </Row>
        );
        var groupNETSPayments = groupBy(netsPayments, function(p) {
          return moment(p.date).format('DD MMM YYYY');
        });
        Object.keys(groupNETSPayments).forEach(date => {
          var subTotal = reduce(
            groupNETSPayments[date],
            function(sum, n) {
              return sum + n.total;
            },
            0
          );
          html.push(
            <Row
              key={'nets' + date}
              style={{
                backgroundColor: '#f5f5f5',
                padding: '8px 15px',
                borderBottom: '1px solid #cccccc'
              }}
            >
              <Col
                xs={6}
                md={6}
                style={{ fontSize: '14px', fontWeight: '800' }}
              >
                {date}
              </Col>
              <Col xs={6} md={6} style={{ textAlign: 'right' }}>
                Day NETS Total : ${subTotal}
              </Col>
            </Row>
          );
          groupNETSPayments[date].map(payment => {
            html.push(
              <Row
                key={payment.key}
                style={{
                  padding: '8px 18px',
                  borderBottom: '1px solid #cccccc'
                }}
              >
                <Col xs={8} md={8} style={{ fontSize: '12px' }}>
                  <Glyphicon glyph="user" /> {payment.childName}
                </Col>
                <Col
                  xs={4}
                  md={4}
                  style={{ textAlign: 'right', fontSize: '12px' }}
                >
                  ${payment.total}
                </Col>
              </Row>
            );
            total += payment.total;
          });
        });
        html.push(
          <Row
            key="totalNETSPayment"
            style={{
              padding: '8px 15px',
              borderBottom: '1px solid #cccccc',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Col xs={6} md={6} />
            <Col
              xs={6}
              md={6}
              style={{
                fontWeight: 'bold',
                textAlign: 'right',
                fontSize: '14px'
              }}
            >
              Month Total NETS: ${total}
            </Col>
          </Row>
        );
        grandTotal += total;
      }

      var bankTransferPayments = filter(filteredPayments, [
        'paymentMethod',
        'Bank Transfer'
      ]);
      if (size(bankTransferPayments) !== 0) {
        var total = 0;
        html.push(
          <Row
            key="banktransferpayments"
            style={{
              backgroundColor: '#656565',
              padding: '0px 15px',
              color: '#ffc600'
            }}
          >
            <Col xs={12} md={12}>
              <h5>Bank Transfers</h5>
            </Col>
          </Row>
        );
        var groupBankTransferPayments = groupBy(
          bankTransferPayments,
          function(p) {
            return moment(p.date).format('DD MMM YYYY');
          }
        );
        Object.keys(groupBankTransferPayments).forEach(date => {
          var subTotal = reduce(
            groupBankTransferPayments[date],
            function(sum, n) {
              return sum + n.total;
            },
            0
          );
          html.push(
            <Row
              key={'banktransfer' + date}
              style={{
                backgroundColor: '#f5f5f5',
                padding: '8px 15px',
                borderBottom: '1px solid #cccccc'
              }}
            >
              <Col
                xs={6}
                md={6}
                style={{ fontSize: '14px', fontWeight: '800' }}
              >
                {date}
              </Col>
              <Col xs={6} md={6} style={{ textAlign: 'right' }}>
                Bank Transfer Total : ${subTotal}
              </Col>
            </Row>
          );
          groupBankTransferPayments[date].map(payment => {
            html.push(
              <Row
                key={payment.childKey}
                style={{
                  padding: '8px 18px',
                  borderBottom: '1px solid #cccccc'
                }}
              >
                <Col xs={8} md={8} style={{ fontSize: '12px' }}>
                  <Glyphicon glyph="user" /> {payment.childName}
                </Col>
                <Col
                  xs={4}
                  md={4}
                  style={{ textAlign: 'right', fontSize: '12px' }}
                >
                  ${payment.total}
                </Col>
              </Row>
            );
            total += payment.total;
          });
        });
        html.push(
          <Row
            key="totalBankTransferPayment"
            style={{
              padding: '8px 15px',
              borderBottom: '1px solid #cccccc',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Col xs={6} md={6} />
            <Col
              xs={6}
              md={6}
              style={{
                fontWeight: 'bold',
                textAlign: 'right',
                fontSize: '14px'
              }}
            >
              Month Total Bank Transfer: ${total}
            </Col>
          </Row>
        );
        grandTotal += total;
      }
      var chequePayments = filter(filteredPayments, [
        'paymentMethod',
        'Cheque'
      ]);
      if (size(chequePayments) !== 0) {
        var total = 0;
        html.push(
          <Row
            key="chequepayments"
            style={{
              backgroundColor: '#656565',
              padding: '0px 15px',
              color: '#ffc600'
            }}
          >
            <Col xs={12} md={12}>
              <h5>Cheque Collections</h5>
            </Col>
          </Row>
        );
        var groupChequePayments = groupBy(chequePayments, function(p) {
          return moment(p.date).format('DD MMM YYYY');
        });
        Object.keys(groupChequePayments).forEach(date => {
          var subTotal = reduce(
            groupChequePayments[date],
            function(sum, n) {
              return sum + n.total;
            },
            0
          );
          html.push(
            <Row
              key={'cheque' + date}
              style={{
                backgroundColor: '#f5f5f5',
                padding: '8px 15px',
                borderBottom: '1px solid #cccccc'
              }}
            >
              <Col
                xs={6}
                md={6}
                style={{ fontSize: '14px', fontWeight: '800' }}
              >
                {date}
              </Col>
              <Col xs={6} md={6} style={{ textAlign: 'right' }}>
                Day Cash Total : ${subTotal}
              </Col>
            </Row>
          );
          groupChequePayments[date].map(payment => {
            html.push(
              <Row
                key={payment.childKey}
                style={{
                  padding: '8px 18px',
                  borderBottom: '1px solid #cccccc',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Col xs={5} md={5} style={{ fontSize: '12px' }}>
                  <Glyphicon glyph="user" /> {payment.childName}
                </Col>
                <Col xs={4} md={4}>
                  #{payment.chequeNumber}
                </Col>
                <Col
                  xs={3}
                  md={3}
                  style={{ textAlign: 'right', fontSize: '12px' }}
                >
                  ${payment.total}
                </Col>
              </Row>
            );
            total += payment.total;
          });
        });
        html.push(
          <Row
            key="totalChequePayment"
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid #cccccc',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Col xs={6} md={6} />
            <Col
              xs={6}
              md={6}
              style={{
                fontWeight: 'bold',
                textAlign: 'right',
                fontSize: '14px'
              }}
            >
              Month Total Cheque: ${total}
            </Col>
          </Row>
        );
        grandTotal += total;
      }
    } else {
      html.push(
        <Row
          key="noCollection"
          style={{
            marginTop: '10px',
            marginBottom: '30px',
            textAlign: 'center'
          }}
        >
          <Col xs={12} md={12}>
            <b style={{ fontSize: '14px' }}>No Payment Collected</b>
          </Col>
        </Row>
      );
    }
    var monthOptions = [];
    monthOptions.push( <option key={"Select"} value={"Select"}>
    Select
   </option>)
    for (var i = 0; i < 12; i++) {
      if (moment(new Date(this.state.year, i, 0)).isSameOrBefore()) {
        monthOptions.push(
          <option key={i} value={i}>
            {moment().month(i).format('MMM')}
          </option>
        );
      }
    }

    var yearOptions = [];
    yearOptions.push( <option key={"Select"} value={"Select"}>
    Select
   </option>)
    yearOptions.push(
      <option key={moment().year()} value={moment().year()}>
        {moment().year()}
      </option>
    );
    yearOptions.push(
      <option key={moment().year() - 1} value={moment().year() - 1}>
        {moment().year() - 1}
      </option>
    );

    return (
      <div>
        <Row
          style={{
            backgroundColor: '#ffc600',
            color: '#656565',
            padding: '10px 15px'
          }}
        >
          <Col xs={3} md={3}>
            <FormGroup>
              <FormControl
                style={{ padding: '6px 6px 5px 2px' }}
                id="yearSelect"
                componentClass="select"
                placeholder="select"
                defaultValue={this.state.year}
                onChange={this.handleSelectYear}
              >
                {yearOptions}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={3} md={3} style={{ paddingLeft: '0px' }}>
            <FormGroup>
              <FormControl
                style={{ padding: '6px 6px 5px 2px', width: '75%' }}
                id="monthSelect"
                componentClass="select"
                placeholder="select"
                defaultValue={this.state.month}
                onChange={this.handleSelectMonth}
              >
                {monthOptions}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={6} md={6}>
            <p
              style={{
                margin: '5px 0px',
                fontSize: '16px',
                fontWeight: '700',
                float: 'right'
              }}
            >
              Collections : ${grandTotal}
            </p>
          </Col>
        </Row>
        {html}
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(TotalCollectionHQ);
