import React from 'react';
import {
  Tabs,
  Tab,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Panel,
  Button,
  Modal,
  HelpBlock
} from 'react-bootstrap';
import {
  addPayment,
  startCredits,
  useStudentCredit,
  startPromotions
} from 'actions';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import moment from 'moment';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import PaymentPromotionSelector from 'PaymentPromotionSelector';
import PaymentDatesSelector from 'PaymentDatesSelector';
import SendMail from 'SendMail';
import InvoiceTemplate from 'InvoiceTemplate';
import { browserHistory } from 'react-router';
import { getTermByDate, getCalendarKey, getCalendarDates } from 'helper';

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payer: [],
      startDate: [],
      receivedDate: moment(),
      calendarDates: [],
      calendarKeys: [],
      numOfSession: [],
      promotions: [],
      promotion: 0,
      selectedTermDates: [],
      deselectedTermDates: [],
      form: '',
      show: false,
      errorId: null,
      errorMessage: null,
      emailError: null,
      emailErrorMessage: null,
      email: '',
      prorateAmount: [],
      coachDiscount: false
    };
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    var {
      students,
      calendars,
      classes,
      selection,
      coaches,
      makeUps,
      credits,
      promotions,
      dispatch
    } = this.props;

    if (isEmpty(credits)) {
      dispatch(startCredits());
    }
    if (isEmpty(promotions)) {
      dispatch(startPromotions());
    }

    //Initiate Payer
    const studentId = this.props.params.studentId;
    let payer = [];
    let filteredStudents = filter(students, o => {
      return !(o.status === 'Not Active');
    });
    filteredStudents = filter(filteredStudents, { venueId: selection.id });
    let student = find(filteredStudents, { key: studentId });

    if (student.email !== '') {
      if (findIndex(coaches, { email: student.email }) !== -1) {
        this.setState({ coachDiscount: true });
      }
    }

    if (student.contact !== '' && student.contact !== undefined) {
      payer = filter(filteredStudents, { contact: student.contact });
    } else {
      payer.push(student);
    }
    this.setState({ payer });

    //Initiate Selectable Term Dates
    var calendarDates = [];
    var startDates = [];
    var calendarKeys = [];

    payer.map((child, id) => {
      
      var calendarKey = getCalendarKey(child, classes);
      var calendar = calendars[calendarKey];
      var currentTerm = getTermByDate(calendar, moment());
      var currentYear = moment().year()
      var startDate = moment(calendar.terms[currentYear][currentTerm][0]);
      var calendarDate = getCalendarDates(calendar);
      if (child.payments !== undefined) {
        Object.keys(child.payments).map(paymentId => {
          var payment = child.payments[paymentId];
          if (payment.termsPaid !== undefined) {
            Object.keys(payment.termsPaid).map(termId => {
              var term = payment.termsPaid[termId];
              term.map(session => {
                var index = findIndex(calendarDate, d => {
                  return moment(d).isSame(session.date, 'day');
                });
                if (index !== -1) {
                  calendarDate.splice(index, 1);
                }
              });
            });
          }
        });
      }
      let filteredMakeUps = filter(makeUps, { studentKey: child.key });
      if (!isEmpty(filteredMakeUps)) {
        filteredMakeUps.map(makeUp => {
          var index = findIndex(calendarDate, d => {
            return moment(d).isSame(makeUp.toDate, 'day');
          });
          if (index !== -1) {
            calendarDate.splice(index, 1);
          }
        });
      }

      startDates[id] = startDate;
      calendarDates[id] = calendarDate;
      calendarKeys[id] = calendarKey;
    });
    this.setState({ calendarKeys });
    this.setState({ calendarDates });
    this.setState({ startDate: startDates });
  }

  handleProrate(e, count) {
    var prorateAmount = this.state.prorateAmount;
    prorateAmount[count] = e.target.value;
    this.setState({ prorateAmount });
  }

  handlePromotionSelected(value, count) {
    let promotions = this.state.promotions;
    promotions[count] = value;
    this.setState({ promotions });
  }

  handleChange(date, count) {
    var dates = this.state.startDate;
    dates[count] = moment(date)
    this.setState({
      startDate: dates
    });
  }

  handleReceivedDate(date) {
    this.setState({
      receivedDate: date
    });
  }

  handleForm(e, type) {
    e.preventDefault();
    this.setState({ form: type });
  }

  handleDatesChange(selected, payerId) {
    var selectedTermDates = this.state.selectedTermDates;
    selectedTermDates[payerId] = selected;
    this.setState({ selectedTermDates });
  }

  handleDeSelected(deselected, payerId) {
    var deselectedTermDates = this.state.deselectedTermDates;
    deselectedTermDates[payerId] = deselected;
    this.setState({ deselectedTermDates });
  }

  checkValid(e) {
    var email = '';
    var count = 0;
    if (this.state.form === 'NETS') {
      var refNumber = document.getElementById('refNumber').value;
      if (refNumber === '') {
        this.setState({ errorID: 'error' });
        this.setState({ errorMessage: 'Please enter reference number' });
        count = 1;
      } else {
        this.setState({ errorID: null });
        this.setState({ errorMessage: null });
      }
    }
    if (this.state.form === 'Cheque') {
      var chequeNumber = document.getElementById('chequeNumber').value;
      if (chequeNumber === '' || chequeNumber.length < 6) {
        this.setState({ errorID: 'error' });
        this.setState({ errorMessage: 'Please enter 6 digit cheque number' });
        count = 1;
      } else {
        this.setState({ errorID: null });
        this.setState({ errorMessage: null });
      }
    }
    email = document.getElementById('email').value;
    if (email === '') {
      this.setState({ emailError: 'error' });
      this.setState({
        emailErrorMessage: 'Please enter a valid email address'
      });
      count = 2;
    } else {
      this.setState({ email });
      this.setState({ errorID: null });
      this.setState({ errorMessage: null });
    }
    if (count === 0) {
      this.setState({ show: true });
    }
  }

  formSubmit(e) {
    e.preventDefault();
    var { dispatch, calendars, credits, selection, promotions } = this.props;
    let filteredCredits = filter(credits, o => {
      return o.dateUsed === undefined;
    });
    var paymentDetails = [];
    this.state.payer.map((student, id) => {
      //Term Id
      var termsPaid = [];
      var total = 0;
      var earlyBird = false;
      var perSession;
      var siblingDiscount = false;
      var payerTerm = [];
      var siblingDiscountAmount = 0;
      var paidSessions = 0;
      this.state.selectedTermDates[id].map((term, termId) => {
        var paymentTerm = [];

        term.map(date => {
          var index = findIndex(this.state.deselectedTermDates[id], d => {
            return moment(d).isSame(date);
          });
          if (index === -1) {
            paymentTerm.push(date);
          }
        });
        if (paymentTerm.length !== 0) {
          payerTerm[termId] = paymentTerm;
          paidSessions += paymentTerm.length;
        }
      });
      let discountAmount, discountName;
      payerTerm.map((term, termId) => {
        let cost = 0;

        switch (size(term)) {
          case 8:
            cost = 300;
            perSession = 37.5;
            break;
          case 7:
            cost = 270;
            perSession = 38.5;
            break;
          case 6:
            cost = 240;
            perSession = 40;
            break;
          case 5:
            cost = 220;
            perSession = 44;
            break;
          default:
            cost = term.length * (paidSessions > 8 ? 35 : 45);
            perSession = paidSessions > 8 ? 35 : 45;
            break;
        }
        total += cost;
        var actualTerm;

        Object.keys(calendars).map(calendarKey => {
          var calendar = calendars[calendarKey];
          if (calendar.key === this.state.calendarKeys[id]) {
            actualTerm = calendar.terms[termId];
          }
        });
        if (this.state.coachDiscount) {
          total += cost * 0.5;
          perSession = 18;
        } else {
          if (
            term.length === actualTerm.length &&
            moment().isSameOrBefore(actualTerm[0], 'day')
          ) {
            earlyBird = true;
            total -= 20;
            cost -= 20;
          } else if (
            term.length === actualTerm.length &&
            moment(this.state.receivedDate).isSameOrBefore(actualTerm[0], 'day')
          ) {
            earlyBird = true;
            total -= 20;
            cost -= 20;
          }
          let type;
          let selectedPromotion = this.state.promotions[id];
          if (selectedPromotion !== undefined && selectedPromotion !== '0') {
            if (
              promotions[selectedPromotion].centres === 'All' ||
              promotions[selectedPromotion].centres === selection.name
            ) {
              let discount = promotions[selectedPromotion].discount;
              discountName = promotions[selectedPromotion].name;
              type = promotions[selectedPromotion].type;
              if (type === 'Percentage') {
                discountAmount = cost * discount / 100;
                total -= discountAmount;
              } else if (type === 'Amount') {
                discountAmount = discount;
                total -= discountAmount;
              }
            }
          }

          if (id === 1 && term.length >= 5) {
            siblingDiscount = true;
            siblingDiscountAmount += 20;
            total -= 20;
          } else if (id > 1 && term.length >= 5) {
            siblingDiscount = true;
            siblingDiscountAmount += 30;
            total -= 30;
          }
        }

        var datesPaid = [];
        term.map(date => {
          datesPaid.push({
            date,
            perSession
          });
        });
        termsPaid[termId] = datesPaid;
      });

      if (this.state.prorateAmount[id] !== undefined) {
        total -= this.state.prorateAmount[id];
      }
      let paymentDetail = {};
      let studentCredits = filter(filteredCredits, { studentKey: student.key });
      if (studentCredits.length > 0) {
        let totalCredit = 0;
        studentCredits.map(credit => {
          const newCredit = {
            ...credit,
            dateUsed: moment(this.state.receivedDate).format()
          };
          dispatch(useStudentCredit(newCredit));
          total -= credit.amount;
          totalCredit += credit.amount;
        });
        paymentDetail.credit = totalCredit;
      }
      if (discountAmount !== undefined) {
        paymentDetail.discount = discountAmount;
        paymentDetail.discountName = discountName;
      }
      paymentDetail = {
        ...paymentDetail,
        centreId: student.venueId.toString(),
        childKey: student.key,
        childName: student.childName,
        ageGroup: student.ageGroup,
        earlyBird,
        coachDiscount: this.state.coachDiscount,
        date: moment(this.state.receivedDate).format(),
        siblingDiscount,
        siblingDiscountAmount: siblingDiscount ? siblingDiscountAmount : null,
        total: total,
        prorate:
          this.state.prorateAmount[id] !== undefined
            ? this.state.prorateAmount[id]
            : null,
        termsPaid,
        paymentMethod: this.state.form,
        email: this.state.email
      };
      if (this.state.form === 'Cheque') {
        paymentDetail.chequeNumber = document.getElementById(
          'chequeNumber'
        ).value;
      } else if (this.state.form === 'NETS') {
        paymentDetail.refNumber = document.getElementById('refNumber').value;
      }
      dispatch(addPayment(paymentDetail));

      paymentDetails.push(paymentDetail);
    });
    let invoiceHTML = InvoiceTemplate.render(paymentDetails);
    SendMail.mail(
      this.state.email,
      'First Kick Academy - Payment Receipt',
      invoiceHTML
    );
    browserHistory.push('/m/payment');
  }

  render() {
    const { calendars, selection, credits, promotions } = this.props;

    let filteredCredits = filter(credits, o => {
      return o.dateUsed === undefined;
    });
    //Render Tabs
    var tabs = [];
    var fees = [];
    var totalFee = 0;
    var email = '';
    
    this.state.payer.map((student, id) => {
      email = student.email;
      tabs.push(
        <Tab eventKey={id} key={student.key} title={student.childName}>
          <Row style={{ padding: '10px 20px' }}>
            <Col xs={12} md={12}>
              <FormGroup style={{ marginBottom: '0' }}>
                <ControlLabel>Start Date</ControlLabel>
                <DatePicker
                  id={'datePicker' + id}
                  selected={moment(this.state.startDate[id])}
                  includeDates={this.state.calendarDates[id]}
                  onSelect={(date)=>
                    this.handleChange(date, id)
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <Row style={{ padding: '5px 20px' }}>
            <Col>
              <PaymentDatesSelector
                key={id}
                startDate={this.state.startDate[id]}
                calendarKey={this.state.calendarKeys[id]}
                calendarDates={this.state.calendarDates[id]}
                deselected={this.state.deselectedTermDates[id]}
                onChange={this.handleDatesChange.bind(this)}
                onDeselect={this.handleDeSelected.bind(this)}
                student={student}
                payerId={id}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12} xs={12}>
              <PaymentPromotionSelector
                id={id}
                onChange={this.handlePromotionSelected.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12} xs={12}>
              <Panel>
                <Panel.Heading>
                <font style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Pro-rate from Last Term
                  </font>
                </Panel.Heading>
                <Panel.Body>
                <FormGroup>
                  <ControlLabel>Amount</ControlLabel>
                  <FormControl
                    style={{ marginBottom: '10px' }}
                    id={'prorateAmount' + student.key}
                    type="text"
                    placeholder="Enter Amount"
                    onChange={e => {
                      this.handleProrate(e, id);
                    }}
                  />
                </FormGroup>
                </Panel.Body>
              </Panel>

               
              </Panel>
            </Col>
          </Row>
        </Tab>
      );
      fees.push(
        <Row key={'Name' + id} style={{ paddingLeft: '10px' }}>
          <Col xs={8} md={8}>
            <p style={{ fontWeight: '800', textDecoration: 'underline' }}>
              {student.childName}
            </p>
          </Col>
        </Row>
      );
      var payerTerm = [];
      var paidSessions = 0;
      if (this.state.selectedTermDates[id] !== undefined) {
        this.state.selectedTermDates[id].map((term, termId) => {
          var paymentTerm = [];
          term.map(date => {
            var index = findIndex(this.state.deselectedTermDates[id], d => {
              return moment(d).isSame(date);
            });
            if (index === -1) {
              paymentTerm.push(date);
            }
          });
          if (paymentTerm.length !== 0) {
            paidSessions += paymentTerm.length;
            payerTerm[termId] = paymentTerm;
          }
        });
      }

      if (payerTerm !== undefined) {
        var totalSession = 0;
        payerTerm.forEach((term, termId) => {
          var cost;
          switch (term.length) {
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
          totalFee += cost;
          totalSession += term.length;
          var datehtml = [];
          term.map((date, dateId) => {
            if (dateId === 0) {
              datehtml.push(
                <font key={date} style={{ fontSize: '9px' }}>
                  <i>
                    {moment(date).format('D MMM')}
                  </i>
                </font>
              );
            } else {
              datehtml.push(
                <font key={date} style={{ fontSize: '9px' }}>
                  <i>
                    , {moment(date).format('D MMM')}
                  </i>
                </font>
              );
            }
          });
          fees.push(
            <Row
              key={student.childName + termId}
              style={{
                padding: '0px 15px',
                marginTop: '5px',
                lineHeight: '12px'
              }}
            >
              <Col xs={8} md={8}>
                <b>Term {termId}</b> ({term.length} sessions)
              </Col>
              <Col xs={4} md={4} style={{ textAlign: 'right' }}>
                ${cost}
              </Col>
              <Col xs={12} md={12} style={{ marginTop: '0px' }}>
                {datehtml}
              </Col>
            </Row>
          );
          var actualTerm;
          Object.keys(calendars).map(calendarKey => {
            var calendar = calendars[calendarKey];
            if (calendar.key === this.state.calendarKeys[id]) {
              actualTerm = calendar.terms[termId];
            }
          });
          if (this.state.coachDiscount) {
            var coachdiscount = cost * 0.5;
            cost = cost - coachdiscount;
            fees.push(
              <Row
                key={'coachDiscount' + student.childName}
                style={{ padding: '0px 15px', marginTop: '5px' }}
              >
                <Col xs={8} md={8}>
                  <b style={{ color: '#1796d3' }}>Coach Discount</b>
                </Col>
                <Col xs={4} md={4} style={{ float: 'right' }}>
                  <p style={{ textAlign: 'right' }}>
                    (${coachdiscount})
                  </p>
                </Col>
              </Row>
            );
          } else {
            if (
              term.length === actualTerm.length &&
              moment().isSameOrBefore(actualTerm[0], 'day')
            ) {
              fees.push(
                <Row
                  key={'earlybird' + termId + student.childName}
                  style={{ padding: '0px 15px', marginTop: '5px' }}
                >
                  <Col xs={8} md={8}>
                    <b style={{ color: '#1796d3' }}>Early Bird Discount</b>
                  </Col>
                  <Col xs={4} md={4} style={{ float: 'right' }}>
                    <p style={{ textAlign: 'right' }}>($20)</p>
                  </Col>
                </Row>
              );
              totalFee -= 20;
              cost -= 20;
            } else if (
              term.length === actualTerm.length &&
              moment(this.state.receivedDate).isSameOrBefore(
                actualTerm[0],
                'day'
              )
            ) {
              fees.push(
                <Row
                  key={'earlybird' + termId + student.childName}
                  style={{ padding: '0px 15px', marginTop: '5px' }}
                >
                  <Col xs={8} md={8}>
                    <b style={{ color: '#1796d3' }}>Early Bird Discount</b>
                  </Col>
                  <Col xs={4} md={4} style={{ float: 'right' }}>
                    <p style={{ textAlign: 'right' }}>($20)</p>
                  </Col>
                </Row>
              );
              totalFee -= 20;
              cost -= 20;
            }
            let type, discountName, discountAmount;
            let selectedPromotion = this.state.promotions[id];
            if (selectedPromotion !== undefined && selectedPromotion !== '0') {
              if (
                promotions[selectedPromotion].centres === 'All' ||
                promotions[selectedPromotion].centres === selection.name
              ) {
                let discount = promotions[selectedPromotion].discount;
                discountName = promotions[selectedPromotion].name;
                type = promotions[selectedPromotion].type;
                if (type === 'Percentage') {
                  discountAmount = cost * discount / 100;
                  totalFee -= discountAmount;
                } else if (type === 'Amount') {
                  discountAmount = discount;
                  totalFee -= discountAmount;
                }
              }
              fees.push(
                <Row
                  key={'discount' + termId + student.childName}
                  style={{ padding: '0px 15px', marginTop: '5px' }}
                >
                  <Col xs={8} md={8}>
                    <b style={{ color: '#1796d3' }}>
                      {discountName} Discount
                    </b>
                  </Col>
                  <Col xs={4} md={4} style={{ float: 'right' }}>
                    <p style={{ textAlign: 'right' }}>
                      (${discountAmount})
                    </p>
                  </Col>
                </Row>
              );
            }
            if ((id === 1) & (term.length >= 5)) {
              fees.push(
                <Row
                  key={'siblingdiscount' + student.childName}
                  style={{ padding: '0px 15px', marginTop: '5px' }}
                >
                  <Col xs={8} md={8}>
                    <b style={{ color: '#1796d3' }}>Sibling Discount</b>
                  </Col>
                  <Col xs={4} md={4} style={{ float: 'right' }}>
                    <p style={{ textAlign: 'right' }}>($20)</p>
                  </Col>
                </Row>
              );
              totalFee -= 20;
            } else if ((id > 1) & (term.length >= 5)) {
              fees.push(
                <Row
                  key={'siblingdiscount' + student.childName}
                  style={{ padding: '0px 15px', marginTop: '5px' }}
                >
                  <Col xs={8} md={8}>
                    <b style={{ color: '#1796d3' }}>Sibling Discount</b>
                  </Col>
                  <Col xs={4} md={4} style={{ float: 'right' }}>
                    <p style={{ textAlign: 'right' }}>($30)</p>
                  </Col>
                </Row>
              );
              totalFee -= 30;
            }
          }
        });
      }
      let studentCredits = filter(filteredCredits, { studentKey: student.key });
      if (studentCredits.length > 0) {
        let totalCredit = reduce(
          studentCredits,
          function(sum, n) {
            return sum + n.amount;
          },
          0
        );
        fees.push(
          <Row
            key={'credit' + id}
            style={{ padding: '0px 15px', marginTop: '5px' }}
          >
            <Col xs={8} md={8}>
              <b style={{ color: '#1796d3' }}>Credits</b>
            </Col>
            <Col xs={4} md={4} style={{ float: 'right' }}>
              <p style={{ textAlign: 'right' }}>
                (${totalCredit})
              </p>
            </Col>
          </Row>
        );
        totalFee -= totalCredit;
      }
      if (this.state.prorateAmount[id] !== undefined) {
        if (this.state.prorateAmount[id] !== '') {
          fees.push(
            <Row
              key={'prorate' + id}
              style={{ padding: '0px 15px', marginTop: '5px' }}
            >
              <Col xs={8} md={8}>
                <b style={{ color: '#1796d3' }}>Pro-rate</b>
              </Col>
              <Col xs={4} md={4} style={{ float: 'right' }}>
                <p style={{ textAlign: 'right' }}>
                  (${this.state.prorateAmount[id]})
                </p>
              </Col>
            </Row>
          );
          totalFee -= this.state.prorateAmount[id];
        }
      }
    });

    var formhtml = [];
    var chequeClass = 'datebtn';
    var cashClass = 'datebtn';
    var bankTransferClass = 'datebtn';
    var netsClass = 'datebtn';
    if (this.state.form === 'Cheque') {
      formhtml.push(
        <Row key={'cheque'} style={{ marginTop: '15px', textAlign: 'center' }}>
          <Col md={6} xs={6}>
            <ControlLabel>Amount Collected</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px', textAlign: 'center' }}
              id="collectedAmount"
              type="text"
              placeholder="Enter amount collected (SGD$)"
              value={totalFee}
              disabled
            />
            <FormGroup>
              <ControlLabel>Date Received</ControlLabel>
              <DatePicker
                className="form-control"
                style={{ textAlign: 'center' }}
                id="paymentDatePicker"
                dateFormat="DD-MM-YYYY"
                selected={this.state.receivedDate}
                onChange={e => {
                  this.handleReceivedDate(moment(e));
                }}
              />
            </FormGroup>
          </Col>
          <Col md={6} xs={6}>
            <FormGroup validationState={this.state.errorID}>
              <ControlLabel>Cheque No.</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px', textAlign: 'center' }}
                autoFocus
                id="chequeNumber"
                type="text"
                placeholder="Enter Cheque No."
              />
              <HelpBlock>
                {this.state.errorMessage}
              </HelpBlock>
            </FormGroup>
            <FormGroup validationState={this.state.emailError}>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px', textAlign: 'center' }}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={email}
              />
              <HelpBlock>
                {this.state.emailErrorMessage}
              </HelpBlock>
            </FormGroup>
          </Col>
          <Col md={12} xs={12}>
            <button className="submitbtn" onClick={this.checkValid.bind(this)}>
              Payment Collected
            </button>
          </Col>
        </Row>
      );
      chequeClass = 'downbtn';
    }
    if (this.state.form === 'NETS') {
      formhtml.push(
        <Row key={'nets'} style={{ marginTop: '15px', textAlign: 'center' }}>
          <Col md={6} xs={6}>
            <ControlLabel>Amount Collected</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px', textAlign: 'center' }}
              id="collectedAmount"
              type="text"
              placeholder="Enter amount collected (SGD$)"
              value={totalFee}
              disabled
            />
            <FormGroup>
              <ControlLabel>Date Received</ControlLabel>
              <DatePicker
                className="form-control"
                style={{ textAlign: 'center' }}
                id="paymentDatePicker"
                dateFormat="DD-MM-YYYY"
                selected={this.state.receivedDate}
                onChange={e => {
                  this.handleReceivedDate(moment(e));
                }}
              />
            </FormGroup>
          </Col>
          <Col md={6} xs={6}>
            <FormGroup validationState={this.state.errorID}>
              <ControlLabel>Ref No.</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px', textAlign: 'center' }}
                autoFocus
                id="refNumber"
                type="text"
                placeholder="Enter Ref No."
              />
              <HelpBlock>
                {this.state.errorMessage}
              </HelpBlock>
            </FormGroup>
            <FormGroup validationState={this.state.emailError}>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px', textAlign: 'center' }}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={email}
              />
              <HelpBlock>
                {this.state.emailErrorMessage}
              </HelpBlock>
            </FormGroup>
          </Col>
          <Col md={12} xs={12}>
            <button className="submitbtn" onClick={this.checkValid.bind(this)}>
              Payment Collected
            </button>
          </Col>
        </Row>
      );
      netsClass = 'downbtn';
    } else if (this.state.form === 'Bank Transfer') {
      formhtml.push(
        <Row
          key={'banktransfer'}
          style={{ marginTop: '15px', textAlign: 'center' }}
        >
          <Col md={6} xs={6}>
            <ControlLabel>Amount Collected</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px', textAlign: 'center' }}
              id="collectedAmount"
              type="text"
              placeholder="Enter amount collected (SGD$)"
              value={totalFee}
              disabled
            />
          </Col>
          <Col md={6} xs={6}>
            <FormGroup>
              <ControlLabel>Date Received</ControlLabel>
              <DatePicker
                className="form-control"
                style={{ textAlign: 'center' }}
                id="paymentDatePicker"
                dateFormat="DD-MM-YYYY"
                selected={this.state.receivedDate}
                onChange={e => {
                  this.handleReceivedDate(moment(e));
                }}
              />
            </FormGroup>
            <FormGroup validationState={this.state.emailError}>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px', textAlign: 'center' }}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={email}
              />
              <HelpBlock>
                {this.state.emailErrorMessage}
              </HelpBlock>
            </FormGroup>
          </Col>
          <Col md={12} xs={12}>
            <button className="submitbtn" onClick={this.checkValid.bind(this)}>
              Payment Collected
            </button>
          </Col>
        </Row>
      );
      bankTransferClass = 'downbtn';
    } else if (this.state.form === 'Cash') {
      formhtml.push(
        <Row key={'amount'} style={{ marginTop: '15px', textAlign: 'center' }}>
          <Col md={6} xs={6}>
            <ControlLabel>Amount Collected</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px', textAlign: 'center' }}
              id="collectedAmount"
              type="text"
              autoFocus
              placeholder="Enter amount collected (SGD$)"
              value={totalFee}
              disabled
            />
          </Col>
          <Col md={6} xs={6}>
            <FormGroup>
              <ControlLabel>Date Received</ControlLabel>
              <DatePicker
                className="form-control"
                style={{ textAlign: 'center' }}
                id="paymentDatePicker"
                dateFormat="DD-MM-YYYY"
                selected={this.state.receivedDate}
                onChange={e => {
                  this.handleReceivedDate(moment(e));
                }}
              />
            </FormGroup>
            <FormGroup validationState={this.state.emailError}>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px', textAlign: 'center' }}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={email}
              />
              <HelpBlock>
                {this.state.emailErrorMessage}
              </HelpBlock>
            </FormGroup>
          </Col>
          <Col md={12} xs={12}>
            <button className="submitbtn" onClick={this.checkValid.bind(this)}>
              Payment Collected
            </button>
          </Col>
        </Row>
      );
      cashClass = 'downbtn';
    }

    let close = () => this.setState({ show: false });
    var modalMessage = '';

    if (this.state.form !== '') {
      var chequeNumber = 0;
      if (document.getElementById('chequeNumber') !== null) {
        chequeNumber = document.getElementById('chequeNumber').value;
      }
      if (this.state.form === 'Cash') {
        modalMessage = 'Did you receive cash payment of $' + totalFee + ' ?';
      } else if (this.state.form === 'Bank Transfer') {
        modalMessage = 'Did you receive bank transfer of $' + totalFee + ' ?';
      } else if (this.state.form === 'NETS') {
        modalMessage = 'Did you receive NETS payment of $' + totalFee + ' ?';
      } else {
        modalMessage =
          'Did you receive cheque payment of $' +
          totalFee +
          ' with cheque #' +
          chequeNumber +
          ' ?';
      }
    }

    return (
      <Grid>
        <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Payment Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMessage}
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
        <Row>
          <Col md={12} xs={12}>
            <Tabs
              style={{ marginTop: '5px', fontWeight: '600' }}
              defaultActiveKey={0}
              id="studentPayments"
            >
              {tabs}
            </Tabs>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={12}>
            <Panel>
              <Panel.Heading>
              <font style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  Fees Breakdown
                </font>
              </Panel.Heading>
              <Panel.Body>
              {fees}
              </Panel.Body>
              <Panel.Footer>
              <Row style={{ paddingRight: '20px' }}>
                  <Col xs={8} md={8}>
                    <font style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      Total:
                    </font>
                  </Col>
                  <Col xs={4} md={4}>
                    <font
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        float: 'right',
                        textDecoration: 'underline'
                      }}
                    >
                      ${totalFee}
                    </font>
                  </Col>
                </Row>
              </Panel.Footer>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={12}>
            <Panel>
              <Panel.Heading>
              <font style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  Payment Method
                </font>
              </Panel.Heading>
              <Panel.Body>
              <button
                className={cashClass}
                onClick={e => {
                  this.handleForm(e, 'Cash');
                }}
                style={{ width: '45%', height: '50px' }}
              >
                Cash
              </button>
              <button
                className={chequeClass}
                onClick={e => {
                  this.handleForm(e, 'Cheque');
                }}
                style={{ width: '45%', height: '50px' }}
              >
                Cheque
              </button>
              <button
                className={bankTransferClass}
                onClick={e => {
                  this.handleForm(e, 'Bank Transfer');
                }}
                style={{ width: '45%', height: '50px' }}
              >
                Bank Transfer
              </button>
              <button
                className={netsClass}
                onClick={e => {
                  this.handleForm(e, 'NETS');
                }}
                style={{ width: '45%', height: '50px' }}
              >
                NETS
              </button>
              </Panel.Body>
            </Panel>
          </Col>
          <Col md={12} xs={12}>
            {formhtml}
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    students: state.students,
    calendars: state.calendars,
    classes: filter(state.classes, {centreKey: state.selection.key}),
    selection: state.selection,
    coaches: state.coaches,
    makeUps: state.makeUps,
    credits: state.credits,
    promotions: state.promotions
  };
}

export default connect(mapStateToProps)(PaymentForm);
