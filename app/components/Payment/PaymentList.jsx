import React from "react";
import { Link } from "react-router";
import {
  Row,
  Col,
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from "react-bootstrap";
import { connect } from "react-redux";
import Payer from "Payer";
import { startCredits, addPayment, updateNavTitle, resetPayers } from "actions";
import { RadioGroup, Radio } from "react-radio-group";
import DatePicker from "react-datepicker";
require("react-datepicker/dist/react-datepicker.css");
import StudentsFilter from "StudentsFilter";
import InvoiceTemplateOthers from "InvoiceTemplateOthers";
import { firebaseRef } from "firebaseApp";
import SendMail from "SendMail";
import Search from "Search";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import filter from "lodash/filter";
import size from "lodash/size";
import reduce from "lodash/reduce";

class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      childKey: "",
      childName: "",
      email: "",
      paymentMethod: "Cash",
      receivedDate: moment()
    };
  }

  handleChange(value) {
    this.setState({ paymentMethod: value });
  }

  handleReceivedDate(date) {
    this.setState({
      receivedDate: date
    });
  }

  formSubmit() {
    var { dispatch, users, auth, selection, students } = this.props;
    var user = find(users, ["email", auth.email]);
    var invoiceRef = firebaseRef.child("invoices");
    var newKey = invoiceRef.push().key;
    var payment = {
      paymentDescription: document.getElementById("description").value,
      total: parseInt(document.getElementById("amount").value),
      date: moment(this.state.receivedDate).format(),
      centreId: selection.id,
      childKey: this.state.childKey,
      childName: this.state.childName,
      paymentMethod: this.state.paymentMethod,
      invoiceKey: newKey,
      email: document.getElementById("email").value
    };
    dispatch(addPayment(payment));
    var invoiceHTML = InvoiceTemplateOthers.render(payment);
    var updates = {};
    updates[newKey] = { invoiceHTML };
    invoiceRef.update(updates);
    SendMail.mail(
      document.getElementById("email").value,
      "First Kick Academy - Payment Receipt",
      invoiceHTML
    );
    this.setState({ show: false });
  }

  componentWillMount() {
    const { dispatch, credits } = this.props;
    if (isEmpty(credits)) {
      dispatch(startCredits());
    }
    dispatch(resetPayers());
  }

  componentDidMount() {
    var { dispatch, selection } = this.props;
    dispatch(updateNavTitle("/m/payment", selection.name + " Payment"));
  }

  onShow(e, key, childName, email) {
    e.preventDefault();
    this.setState({ show: true, childKey: key, childName, email });
  }

  render() {
    const { students, searchText, selection, credits } = this.props;
    var html = [];
    var classes = selection.classes;

    //Filter Away Used credits
    var filteredCredits = filter(credits, o => {
      return o.dateUsed === undefined;
    });

    var filteredStudents = StudentsFilter.filter(
      students,
      selection.id,
      searchText
    );
    var activeStudents = filter(filteredStudents, o => {
      return !(o.status === "Not Active");
    });
    var notActiveStudents = filter(filteredStudents, o => {
      return (
        o.status === "Not Active" ||
        o.currentClassDay === "" ||
        o.currentClassTime === "0"
      );
    });

    Object.keys(classes).forEach(classKey => {
      var { day, startTime, endTime, ageGroup, calendarKey } = classes[
        classKey
      ];

      var classTime = startTime + " - " + endTime;

      var classStudents = filter(activeStudents, {
        currentClassDay: day,
        currentClassTime: classTime,
        ageGroup: ageGroup
      });

      if (size(classStudents) !== 0) {
        html.push(
          <div key={ageGroup + classTime + day}>
            <Row
              style={{
                backgroundColor: "#656565",
                padding: "0px 15px",
                color: "#ffc600"
              }}
            >
              <Col xs={12} md={12}>
                <h5>
                  {ageGroup} {classTime} ({day})
                </h5>
              </Col>
            </Row>
            {Object.keys(classStudents).map(studentId => {
              var student = classStudents[studentId];
              let studentCredits = filter(filteredCredits, i => {
                return i.studentKey === student.key && !i.inactive;
              });
              let totalCredit = reduce(
                studentCredits,
                function(sum, n) {
                  return sum + n.amount;
                },
                0
              );
              return (
                <Payer
                  key={student.key}
                  student={student}
                  credit={studentCredits.length > 0}
                  creditAmount={
                    studentCredits !== undefined ? totalCredit : null
                  }
                  onShow={this.onShow.bind(this)}
                />
              );
            })}
          </div>
        );
      }
    });

    if (size(notActiveStudents) !== 0) {
      html.push(
        <div key="Not Active">
          <Row
            style={{
              backgroundColor: "#656565",
              padding: "0px 15px",
              color: "#ffc600"
            }}
          >
            <Col xs={12} md={12}>
              <h5>Not Active Students</h5>
            </Col>
          </Row>
          {Object.keys(notActiveStudents).map(studentId => {
            var student = notActiveStudents[studentId];
            return (
              <Payer
                key={student.key}
                student={student}
                type={"Not Active"}
                onShow={this.onShow.bind(this)}
              />
            );
          })}
        </div>
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
            <Modal.Title id="contained-modal-title">
              Collect Payment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <FormGroup>
                <ControlLabel>Date Received</ControlLabel>
                <DatePicker
                  className="form-control"
                  style={{ textAlign: "center" }}
                  id="paymentDatePicker"
                  dateFormat="DD-MM-YYYY"
                  selected={this.state.receivedDate}
                  onChange={e => {
                    this.handleReceivedDate(moment(e));
                  }}
                />
              </FormGroup>
              <ControlLabel>Payment Description</ControlLabel>
              <FormControl
                style={{ marginBottom: "10px" }}
                id="description"
                type="text"
                placeholder="Enter Payment Description"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <FormControl
                style={{ marginBottom: "10px" }}
                id="amount"
                type="text"
                placeholder="Enter Amount"
              />
            </FormGroup>
            <RadioGroup
              name="fruit"
              style={{ marginBottom: "10px" }}
              selectedValue={this.state.paymentMethod}
              onChange={this.handleChange.bind(this)}
            >
              <label style={{ marginLeft: "5px" }}>
                <Radio value="Cash" />Cash
              </label>
              <label style={{ marginLeft: "5px" }}>
                <Radio value="Cheque" />Cheque
              </label>
              <label style={{ marginLeft: "5px" }}>
                <Radio value="Bank Transfer" />Bank Transfer
              </label>
            </RadioGroup>
            <FormGroup>
              <ControlLabel>Email for Receipt</ControlLabel>
              <FormControl
                style={{ marginBottom: "10px" }}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={this.state.email}
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
        <Row
          style={{
            padding: "8px 10px",
            borderBottom: "1px solid #cccccc",
            display: "flex",
            alignItems: "center"
          }}
        >
          <Col xs={12} md={12}>
            <Search type="student" />
          </Col>
        </Row>
        {html}
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(PaymentList);
