import React from 'react';
import {
  Row,
  Col,
  Modal,
  Panel,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import { updateTrialRegistration, addTrialStudent, addPayment } from 'actions';
import moment from 'moment';
import { firebaseRef } from 'firebaseApp';
import { browserHistory } from 'react-router';
import InvoiceTemplate from 'InvoiceTemplate';
import SendMail from 'SendMail';

class PaymentMethodSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethod: '',
      chequeNumber: '',
      email: props.parent.email,
      show: false
    };
    this.close = this.close.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  close() {
    this.setState({ show: false });
  }

  formSubmit() {
    const { dispatch, paymentDetails, childDetails, parent } = this.props;
    let finalPaymentDetails = [];
    //Get Invoice Key
    const invoiceRef = firebaseRef.child('invoices');
    const newKey = invoiceRef.push().key;

    Object.keys(childDetails).map(payerKey => {
      const { trialId } = childDetails[payerKey];
      let finalPaymentDetail;
      dispatch(updateTrialRegistration(trialId));
      let student = { ...childDetails[payerKey], ...parent };
      let response = dispatch(addTrialStudent(student));
      if (response !== undefined) {
        finalPaymentDetail = {
          ...paymentDetails[payerKey],
          date: moment().format(),
          childKey: response.student.key,
          paymentMethod: this.state.paymentMethod,
          email: this.state.email,
          jerseyIssued: false,
          invoiceKey: newKey
        };
        if (this.state.paymentMethod === 'Cheque') {
          finalPaymentDetail.chequeNumber = this.state.chequeNumber;
        }
      }
      dispatch(addPayment(finalPaymentDetail));
      finalPaymentDetails.push(finalPaymentDetail);
    });
    const invoiceHTML = InvoiceTemplate.render(finalPaymentDetails);
    SendMail.mail(
      this.state.email,
      'First Kick Academy - Payment Receipt',
      invoiceHTML
    );
    browserHistory.push('/m/jersey/');
  }

  render() {
    const {
      total,
      receivedDate,
      handleReceivedDate,
      email,
      formSubmit,
      childDetails,
      paymentDetails,
      parent
    } = this.props;
    return (
      <Row>
        <Modal
          show={this.state.show}
          onHide={this.close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Payment Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Did you receive {this.state.paymentMethod} payment of ${total} ?
          </Modal.Body>
          <Modal.Footer>
            <Button bsSize="large" onClick={this.formSubmit}>
              Yes
            </Button>
            <Button bsSize="large" onClick={this.close}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
        <Col md={12} xs={12} lg={12}>
          <Panel
            header={
              <font style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Payment Method
              </font>
            }
          >
            <button
              className={
                this.state.paymentMethod === 'Cash' ? 'btnoff' : 'btnon'
              }
              onClick={() => this.setState({ paymentMethod: 'Cash' })}
              style={{ width: '32%', height: '50px' }}
            >
              Cash
            </button>
            <button
              className={
                this.state.paymentMethod === 'Cheque' ? 'btnoff' : 'btnon'
              }
              onClick={() => this.setState({ paymentMethod: 'Cheque' })}
              style={{ width: '32%', height: '50px' }}
            >
              Cheque
            </button>
            <button
              className={
                this.state.paymentMethod === 'Bank Transfer'
                  ? 'btnoff'
                  : 'btnon'
              }
              onClick={() => this.setState({ paymentMethod: 'Bank Transfer' })}
              style={{ width: '32%', height: '50px' }}
            >
              Bank<br />Transfer
            </button>
            {this.state.paymentMethod !== ''
              ? <Row style={{ marginTop: '15px', textAlign: 'center' }}>
                  <Col md={6} xs={6} lg={6}>
                    <ControlLabel>Amount Collected</ControlLabel>
                    <FormControl
                      style={{ marginBottom: '15px', textAlign: 'center' }}
                      id="collectedAmount"
                      type="text"
                      autoFocus
                      placeholder="Enter amount collected (SGD$)"
                      value={total}
                      disabled
                    />
                    {this.state.paymentMethod === 'Cheque'
                      ? <FormGroup
                          validationState={
                            this.state.chequeNumber.length !== 6 &&
                            this.state.chequeNumber !== ''
                              ? 'error'
                              : null
                          }
                        >
                          <ControlLabel>Cheque No.</ControlLabel>
                          <FormControl
                            style={{
                              marginBottom: '10px',
                              textAlign: 'center'
                            }}
                            autoFocus
                            id="chequeNumber"
                            type="text"
                            onChange={e =>
                              this.setState({ chequeNumber: e.target.value })}
                            placeholder="Enter Cheque No."
                          />
                          {this.state.chequeNumber.length !== 6 &&
                          this.state.chequeNumber !== ''
                            ? <HelpBlock>
                                Please enter 6 digit cheque number
                              </HelpBlock>
                            : null}
                        </FormGroup>
                      : null}
                  </Col>
                  <Col md={6} xs={6} lg={6}>
                    <FormGroup>
                      <ControlLabel>Date Received</ControlLabel>
                      <DatePicker
                        className="form-control"
                        style={{ textAlign: 'center' }}
                        id="paymentDatePicker"
                        dateFormat="DD-MM-YYYY"
                        selected={receivedDate}
                        onChange={e => {
                          handleReceivedDate(e);
                        }}
                      />
                    </FormGroup>
                    <FormGroup
                      validationState={
                        this.state.email.length === 0 ? 'error' : null
                      }
                    >
                      <ControlLabel>Email</ControlLabel>
                      <FormControl
                        style={{ marginBottom: '10px', textAlign: 'center' }}
                        id="email"
                        type="text"
                        placeholder="Enter Email"
                        defaultValue={parent.email}
                        onChange={e => this.setState({ email: e.target.value })}
                      />
                      {this.state.email.length === 0
                        ? <HelpBlock>Please enter valid email</HelpBlock>
                        : null}
                    </FormGroup>
                  </Col>
                  <Col md={12} xs={12} lg={12}>
                    <button
                      className="submitbtn"
                      onClick={() => {
                        if (this.state.paymentMethod === 'Cheque') {
                          if (
                            this.state.chequeNumber.length === 6 &&
                            this.state.email.length !== 0
                          ) {
                            this.setState({ show: true });
                          }
                        } else {
                          if (this.state.email.length !== 0) {
                            this.setState({ show: true });
                          }
                        }
                      }}
                    >
                      Payment Collected
                    </button>
                  </Col>
                </Row>
              : null}
          </Panel>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    parent: state.parent
  };
}

export default connect(mapStateToProps)(PaymentMethodSelector);
