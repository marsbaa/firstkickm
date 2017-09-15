import React from 'react';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import find from 'lodash/find';
import size from 'lodash/size';
import {
  updateNavTitle,
  startPayments,
  startExpenses,
  deleteExpense,
  addExpense
} from 'actions';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Panel,
  ListGroup,
  ListGroupItem,
  ButtonGroup,
  Grid,
  Glyphicon,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import moment from 'moment';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';
import { isManager } from 'helper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class TotalCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'all',
      show: false,
      value: '',
      startDate: moment()
    };
    this.removeExpense = this.removeExpense.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentWillMount() {
    var { dispatch, payments, selection, expenses } = this.props;
    dispatch(updateNavTitle('/m/total', selection.name + ' Collections'));
    if (isEmpty(payments)) {
      dispatch(startPayments());
    }
    if (isEmpty(expenses)) {
      dispatch(startExpenses());
    }
  }

  removeExpense(key) {
    var { dispatch } = this.props;
    dispatch(deleteExpense(key));
  }

  handleShow() {
    this.setState({ show: true });
  }

  formSubmit() {
    var { dispatch, users, auth, selection } = this.props;
    var user = find(users, ['email', auth.email]);
    var expense = {
      name: this.state.value.value,
      amount: parseInt(document.getElementById('amount').value),
      issuedBy: user.name,
      email: user.email,
      date: moment(this.state.startDate).format(),
      centreId: selection.id
    };
    this.setState({ show: false });
    dispatch(addExpense(expense));
  }

  handleChange(value) {
    this.setState({ value });
  }

  handleSelect(e) {
    e.preventDefault();
    var id = e.target.id;
    var className = e.target.className;
    if (id === 'all' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('am').className = 'normalbtn btn btn-default';
      document.getElementById('pm').className = 'normalbtn btn btn-default';
      this.setState({ filter: 'all' });
    } else if (id === 'am' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('all').className = 'normalbtn btn btn-default';
      document.getElementById('pm').className = 'normalbtn btn btn-default';
      this.setState({ filter: 'am' });
    } else if (id === 'pm' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('all').className = 'normalbtn btn btn-default';
      document.getElementById('am').className = 'normalbtn btn btn-default';
      this.setState({ filter: 'pm' });
    }
  }

  handleDateChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    var { payments, selection, expenses, auth, users } = this.props;
    var html = [];
    var filteredPayments = filter(payments, p => {
      return moment(this.state.startDate).isSame(p.date, 'day');
    });
    var filteredExpenses = filter(expenses, { centreId: selection.id });
    filteredExpenses = filter(filteredExpenses, o => {
      return moment(this.state.startDate).isSame(o.date, 'day');
    });
    if (this.state.filter === 'am') {
      filteredPayments = filter(filteredPayments, p => {
        return moment(p.date).format('HH') <= 12;
      });
      filteredExpenses = filter(filteredExpenses, e => {
        return moment(e.date).format('HH') <= 12;
      });
    } else if (this.state.filter === 'pm') {
      filteredPayments = filter(filteredPayments, p => {
        return moment(p.date).format('HH') > 12;
      });
      filteredExpenses = filter(filteredExpenses, e => {
        return moment(e.date).format('HH') > 12;
      });
    }
    var cashTotal = 0;
    var chequeTotal = 0;
    var netsTotal = 0;
    filteredPayments = filter(filteredPayments, ['centreId', selection.id]);
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
            <Col xs={8} md={8}>
              <h5>Cash Collections</h5>
            </Col>
            <Col xs={4} md={4} />
          </Row>
        );
        cashPayments.map(payment => {
          html.push(
            <Row
              key={payment.key}
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid #cccccc',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Col xs={8} md={8} style={{ fontSize: '14px' }}>
                <Glyphicon glyph="user" /> {payment.childName}
              </Col>
              <Col xs={4} md={4} style={{ textAlign: 'right' }}>
                ${payment.total}
              </Col>
            </Row>
          );
          total += payment.total;
        });
        html.push(
          <Row
            key="totalCashPayment"
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
              Total Cash: ${total}
            </Col>
          </Row>
        );
        cashTotal = total;
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
            <Col xs={8} md={8}>
              <h5>Cheque Collections</h5>
            </Col>
            <Col xs={4} md={4} />
          </Row>
        );
        chequePayments.map(payment => {
          html.push(
            <Row
              key={payment.childKey}
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid #cccccc',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Col xs={5} md={5} style={{ fontSize: '14px' }}>
                <Glyphicon glyph="user" /> {payment.childName}
              </Col>
              <Col xs={4} md={4}>
                #{payment.chequeNumber}
              </Col>
              <Col xs={3} md={3} style={{ textAlign: 'right' }}>
                ${payment.total}
              </Col>
            </Row>
          );
          total += payment.total;
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
              Total Cheque: ${total}
            </Col>
          </Row>
        );
        chequeTotal = total;
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
            <Col xs={8} md={8}>
              <h5>NETS Collections</h5>
            </Col>
            <Col xs={4} md={4} />
          </Row>
        );
        netsPayments.map(payment => {
          html.push(
            <Row
              key={payment.key}
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid #cccccc',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Col xs={8} md={8} style={{ fontSize: '14px' }}>
                <Glyphicon glyph="user" /> {payment.childName}
              </Col>
              <Col xs={4} md={4} style={{ textAlign: 'right' }}>
                ${payment.total}
              </Col>
            </Row>
          );
          total += payment.total;
        });
        html.push(
          <Row
            key="totalCashPayment"
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
              Total NETS: ${total}
            </Col>
          </Row>
        );
        netsTotal = total;
      }
      var expenseshtml = [];
      var expenseTotal = 0;
      if (size(filteredExpenses) !== 0) {
        expenseshtml.push(
          <Row
            key="expenses"
            style={{
              backgroundColor: '#656565',
              padding: '0px 15px',
              color: '#ffc600'
            }}
          >
            <Col xs={8} md={8}>
              <h5>Expenses</h5>
            </Col>
            <Col xs={4} md={4} />
          </Row>
        );
        filteredExpenses.map(expense => {
          expenseshtml.push(
            <Row
              key={expense.key}
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid #cccccc',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Col xs={8} md={8} style={{ fontSize: '14px' }}>
                <Glyphicon glyph="minus" /> {expense.name}{' '}
                <button
                  className="innerbtn"
                  onClick={e => {
                    e.preventDefault();
                    this.removeExpense(expense.key);
                  }}
                >
                  X
                </button>
              </Col>
              <Col xs={4} md={4} style={{ textAlign: 'right' }}>
                ${expense.amount}
              </Col>
            </Row>
          );
          expenseTotal += expense.amount;
        });
        expenseshtml.push(
          <Row
            key="totalExpenses"
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
              Total Expense: ${expenseTotal}
            </Col>
          </Row>
        );
      }

      var summaryhtml = [];
      summaryhtml.push(
        <Panel header="Summary" key="summary" style={{ marginTop: '15px' }}>
          <ListGroup fill>
            <ListGroupItem>
              Cash to Deposit (Cash - Expenses): ${cashTotal - expenseTotal}
            </ListGroupItem>
            <ListGroupItem>
              No. of Cheques to Deposit: {size(chequePayments)}
            </ListGroupItem>
            <ListGroupItem>
              NETS : ${netsTotal}
            </ListGroupItem>
            <ListGroupItem>
              Total Collections (Cash + Cheque + NETS) : ${cashTotal + chequeTotal + netsTotal}
            </ListGroupItem>
          </ListGroup>
        </Panel>
      );
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

    let close = () => this.setState({ show: false });

    return (
      <div>
        <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Add Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Type of Expense</ControlLabel>
              <Creatable
                multi={false}
                options={[
                  { value: 'Drinks', label: 'Drinks' },
                  { value: 'EZLink', label: 'EzLink Top Up' }
                ]}
                onChange={this.handleChange.bind(this)}
                value={this.state.value}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px' }}
                id="amount"
                type="text"
                placeholder="Enter Amount"
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsSize="large" onClick={this.formSubmit.bind(this)}>
              Yes
            </Button>
            <Button bsSize="large" onClick={close}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
        {isManager(auth, users)
          ? <Row
              style={{
                padding: '8px 10px',
                backgroundColor: '#ffc600',
                color: '#656565'
              }}
            >
              <Col xs={12} md={12}>
                <FormGroup style={{ marginBottom: '0' }}>
                  <ControlLabel>Date of Session</ControlLabel>
                  <DatePicker
                    id="datePicker"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.startDate}
                    includeDates={this.state.termDates}
                    onChange={e => {
                      this.handleDateChange(moment(e));
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          : null}
        <Row style={{ textAlign: 'center', margin: '10px 10px' }}>
          <Col xs={8} md={8}>
            <ButtonGroup>
              <Button
                id="all"
                style={{ margin: '0px' }}
                className="selectedbtn"
                onClick={this.handleSelect.bind(this)}
              >
                All
              </Button>
              <Button
                id="am"
                style={{ margin: '0px' }}
                className="normalbtn"
                onClick={this.handleSelect.bind(this)}
              >
                AM
              </Button>
              <Button
                id="pm"
                style={{ margin: '0px' }}
                className="normalbtn"
                onClick={this.handleSelect.bind(this)}
              >
                PM
              </Button>
            </ButtonGroup>
          </Col>
          <Col xs={4} md={4}>
            <Button
              style={{
                margin: '0px',
                textShadow: 'none',
                color: '#656565',
                backgroundColor: '#f5bb05'
              }}
              onClick={this.handleShow.bind(this)}
            >
              Add Expense
            </Button>
          </Col>
        </Row>
        {html}
        {expenseshtml}
        {summaryhtml}
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(TotalCollection);
