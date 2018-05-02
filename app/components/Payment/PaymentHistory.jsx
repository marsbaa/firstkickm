import React from "react";
import filter from "lodash/filter";
import find from "lodash/find";
import { connect } from "react-redux";
import { firebaseRef } from "firebaseApp";
import { updateNavTitle, removePayment } from "actions";
import { isManager } from "helper";
import moment from "moment";
import PaymentDetails from "PaymentDetails";
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
} from "react-bootstrap";
import { browserHistory } from "react-router";
import InvoiceTemplate from "InvoiceTemplate";
import SendMail from "SendMail";

class PaymentHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showR: false,
      paymentKey: "",
      childKey: "",
      email: ""
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.resendReceipt = this.resendReceipt.bind(this);
  }
  componentDidMount() {
    var { dispatch } = this.props;
    dispatch(updateNavTitle("/m/payment", "Payment History"));
  }

  handleSelect(paymentKey, childKey) {
    this.setState({ show: true });
    this.setState({ paymentKey });
    this.setState({ childKey });
  }

  formSubmit() {
    var { dispatch, payments } = this.props;
    var key = _.find(payments, { key: this.state.paymentKey }).invoiceKey;
    var invoiceRef = firebaseRef.child("invoices/" + key);
    invoiceRef.remove();
    dispatch(removePayment(this.state.paymentKey, this.state.childKey));
    this.setState({ show: false });
  }

  resendReceipt(e, payment) {
    const { payments } = this.props;
    let paymentDetails = [payment];
    if (payment.invoiceKey !== "" && payment.invoiceKey !== undefined) {
      paymentDetails = filter(payments, { invoiceKey: payment.invoiceKey });
    }
    const invoiceHTML = InvoiceTemplate.render(paymentDetails);
    SendMail.mail(
      this.state.email,
      "First Kick Academy - Payment Receipt",
      invoiceHTML
    );
    this.setState({ showR: false });
  }

  render() {
    const { payments, student, users, auth } = this.props;
    const paymentHistories = filter(payments, { childKey: student.key });
    var html = [];
    let close = () => this.setState({ show: false });
    let closeR = () => this.setState({ showR: false });

    return (
      <Grid style={{ paddingTop: "20px", paddingBottom: "200px" }}>
        <Row style={{ padding: "10 0" }}>
          <Col>
            <p
              style={{
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
                textDecoration: " underline"
              }}
            >
              {student.childName}
            </p>
            {paymentHistories === undefined ? (
              <p style={{ textAlign: "center" }} key="nohistory">
                No payment history
              </p>
            ) : (
              <PanelGroup key="accordion" accordion>
                {Object.keys(paymentHistories).map(paymentId => {
                  const payment = paymentHistories[paymentId];
                  const {
                    date,
                    total,
                    key,
                    childKey,
                    email,
                    invoiceKey
                  } = payment;
                  return (
                    <Panel
                      header={
                        <Row>
                          <Col xs={7} md={7}>
                            <ControlLabel>
                              {moment(date).format("DD MMM YYYY") +
                                " - Total : $" +
                                total}
                            </ControlLabel>
                          </Col>
                          {isManager(auth, users) ? (
                            <Col xs={5} md={5} style={{ textAlign: "right" }}>
                              <button
                                className="btn"
                                style={{ float: "right" }}
                                onClick={e => {
                                  e.preventDefault();
                                  this.handleSelect(key, childKey);
                                }}
                              >
                                Remove
                              </button>
                            </Col>
                          ) : null}
                        </Row>
                      }
                      footer={
                        <p style={{ textAlign: "right" }}>
                          <button
                            className="btn"
                            onClick={() => this.setState({ showR: true })}
                          >
                            Resend Receipt
                          </button>
                        </p>
                      }
                      eventKey={key}
                      key={key}
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
                              style={{
                                marginBottom: "10px",
                                textAlign: "center"
                              }}
                              id="email"
                              type="text"
                              placeholder="Enter Email"
                              defaultValue={email}
                              onChange={e =>
                                this.setState({ email: e.target.value })
                              }
                            />
                          </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            bsSize="large"
                            onClick={e => this.resendReceipt(e, payment)}
                          >
                            Yes
                          </Button>
                          <Button bsSize="large" onClick={closeR}>
                            No
                          </Button>
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
                          {total} made on {moment(date).format("DD MMM YYYY")} ?
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            bsSize="large"
                            onClick={this.formSubmit.bind(this)}
                          >
                            Yes
                          </Button>
                          <Button bsSize="large" onClick={close}>
                            No
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Panel>
                  );
                })}
              </PanelGroup>
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    payments: state.payments,
    student: find(state.students, { key: props.params.studentId }),
    auth: state.auth,
    users: state.users
  };
}

export default connect(mapStateToProps)(PaymentHistory);
