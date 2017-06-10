import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { firebaseRef } from 'firebaseApp';
var actions = require('actions');
import moment from 'moment';
import PaymentDetails from 'PaymentDetails';
import {
  Grid,
  Col,
  Row,
  PanelGroup,
  Panel,
  ControlLabel,
  Modal,
  Button,
  FormGroup,
  FormControl
} from 'react-bootstrap';
import { browserHistory } from 'react-router';
import SendMail from 'SendMail';

class PaymentHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showR: false,
      paymentKey: '',
      childKey: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.resendReceipt = this.resendReceipt.bind(this);
  }
  componentDidMount() {
    var { dispatch } = this.props;
    dispatch(actions.updateNavTitle('/m/payment', 'Payment History'));
  }

  handleSelect(paymentKey, childKey) {
    this.setState({ show: true });
    this.setState({ paymentKey });
    this.setState({ childKey });
  }

  formSubmit() {
    var { dispatch, payments } = this.props;
    var key = _.find(payments, { key: this.state.paymentKey }).invoiceKey;
    var invoiceRef = firebaseRef.child('invoices/' + key);
    invoiceRef.remove();
    dispatch(actions.removePayment(this.state.paymentKey, this.state.childKey));
    this.setState({ show: false });
  }

  resendReceipt(e, key) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var invoiceRef = firebaseRef.child('invoices/' + key);
    invoiceRef.once('value').then(snapshot => {
      var invoice = snapshot.val();
      SendMail.mail(
        email,
        'First Kick Academy - Payment Receipt',
        invoice.invoiceHTML
      );
    });
    this.setState({ showR: false });
  }

  render() {
    var { payments, students, users, auth } = this.props;
    var user;
    if (auth.email === 'ray@marsbaa.com') {
      user = {
        name: 'Ray Yee',
        email: 'ray@marsbaa.com',
        assignedRoles: 'Manager',
        assignedCentres: { 0: 'all' }
      };
    } else {
      user = _.find(users, ['email', auth.email]);
    }
    var studentId = this.props.params.studentId;
    var student = _.find(students, { key: studentId });
    var html = [];
    let close = () => this.setState({ show: false });
    let closeR = () => this.setState({ showR: false });
    if (student.payments === undefined) {
      html.push(
        <p style={{ textAlign: 'center' }} key="nohistory">
          No payment history
        </p>
      );
    } else {
      html.push(
        <PanelGroup key="accordion" accordion>
          {Object.keys(student.payments).map(paymentId => {
            var payment = _.find(payments, {
              key: student.payments[paymentId].paymentKey
            });
            return (
              <Panel
                header={
                  <Row>
                    <Col xs={7} md={7}>
                      <ControlLabel>
                        {moment(payment.date).format('DD MMM YYYY') +
                          ' - Total : $' +
                          payment.total}
                      </ControlLabel>
                    </Col>
                    {user.assignedRoles === 'Manager'
                      ? <Col xs={5} md={5} style={{ textAlign: 'right' }}>
                          <button
                            className="btn"
                            style={{ float: 'right' }}
                            onClick={e => {
                              e.preventDefault();
                              this.handleSelect(payment.key, payment.childKey);
                            }}
                          >
                            Remove
                          </button>
                        </Col>
                      : null}
                  </Row>
                }
                footer={
                  payment.invoiceKey !== undefined
                    ? <p style={{ textAlign: 'right' }}>
                        <button
                          className="btn"
                          onClick={() => this.setState({ showR: true })}
                        >
                          Resend Receipt
                        </button>
                      </p>
                    : ''
                }
                eventKey={payment.key}
                key={payment.key}
              >
                <PaymentDetails payment={payment} />
                <Modal
                  show={this.state.showR}
                  onHide={closeR}
                  container={this}
                  aria-labelledby="contained-modal-title1"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title1">
                      Resend Receipt
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to resend a copy of receipt?
                    <FormGroup>
                      <ControlLabel>Email</ControlLabel>
                      <FormControl
                        style={{ marginBottom: '10px', textAlign: 'center' }}
                        id="email"
                        type="text"
                        placeholder="Enter Email"
                        defaultValue={payment.email}
                      />
                    </FormGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      bsSize="large"
                      onClick={e =>
                        this.resendReceipt(
                          e,
                          payment.invoiceKey,
                          payment.email
                        )}
                    >
                      Yes
                    </Button>
                    <Button bsSize="large" onClick={close}>No</Button>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={this.state.show}
                  onHide={close}
                  container={this}
                  aria-labelledby="contained-modal-title"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                      Delete Payment Records
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to delete payment record of $
                    {payment.total}
                    {' '}
                    made on
                    {' '}
                    {moment(payment.date).format('DD MMM YYYY')}
                    {' '}
                    ?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button bsSize="large" onClick={this.formSubmit.bind(this)}>
                      Yes
                    </Button>
                    <Button bsSize="large" onClick={close}>No</Button>
                  </Modal.Footer>
                </Modal>
              </Panel>
            );
          })}
        </PanelGroup>
      );
    }

    return (
      <Grid style={{ paddingTop: '20px', paddingBottom: '200px' }}>
        <Row style={{ padding: '10 0' }}>
          <Col>
            <p
              style={{
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                textDecoration: ' underline'
              }}
            >
              {student.childName}
            </p>
            {html}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(state => {
  return state;
})(PaymentHistory);
