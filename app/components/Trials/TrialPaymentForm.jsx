import React from 'react'
import _ from 'lodash'
import {Tabs, Tab, Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Panel, Button, Modal, HelpBlock, Glyphicon} from 'react-bootstrap'
import {datebtn, downbtn} from 'styles.css'
var actions = require('actions')
var {connect} = require('react-redux')
import DatePicker from 'react-datepicker'
require('react-datepicker/dist/react-datepicker.css')
import moment from 'moment'
import PaymentDatesSelector from 'PaymentDatesSelector'
import SendMail from 'SendMail'
import InvoiceTemplate from 'InvoiceTemplate'
import {firebaseRef} from 'app/firebase'
import {browserHistory} from 'react-router'
import {getTerm, getCalendarDates, getCalendarKey} from 'helper'

class TrialPaymentForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      payer : [],
      startDate: [],
      receivedDate: moment(),
      calendarDates: [],
      calendarKeys: [],
      numOfSession: [],
      promotion: 0,
      selectedTermDates: [],
      deselectedTermDates: [],
      form: '',
      show: false,
      errorId: null,
      errorMessage: null,
      emailError: null,
      emailErrorMessage: null,
      email: ''
    };
  }

  handleChange(date, count) {
    var dates = this.state.startDate;
    dates[count] = date;
    this.setState({
      startDate: dates
    });
  }

   handleForm(e, type) {
    e.preventDefault()
    this.setState({form : type})
  }

  handleReceivedDate(date) {
    this.setState({
      receivedDate: date
    });
  }


  handleDatesChange(selected, payerId) {
    var selectedTermDates = this.state.selectedTermDates;
    selectedTermDates[payerId] = selected
    this.setState({selectedTermDates})
  }

  handleDeSelected(deselected, payerId) {
    var deselectedTermDates= this.state.deselectedTermDates;
    deselectedTermDates[payerId] = deselected
    this.setState({deselectedTermDates})
  }

  checkValid(e) {
    var email = ''
    var count = 0
    if (this.state.form === 'Cheque') {
      var chequeNumber = document.getElementById('chequeNumber').value
      if (chequeNumber === '' || chequeNumber.length < 6) {
        this.setState({errorID : 'error'})
        this.setState({errorMessage: 'Please enter 6 digit cheque number'})
        count = 1
      }
      else {
        this.setState({errorID : null})
        this.setState({errorMessage: null})
      }
    }
    email = document.getElementById('email').value
    if (email === '') {
        this.setState({emailError: 'error'})
        this.setState({emailErrorMessage: 'Please enter a valid email address'})
        count = 2
      }
      else {
        this.setState({errorID : null})
        this.setState({errorMessage: null})
      }
      if (count === 0) {
        this.setState({show: true})
      }

  }

  formSubmit(e) {
    e.preventDefault()
    var {dispatch, calendars} = this.props;
    var paymentDetails = [];
    var siblingCount = 0
    var invoiceRef = firebaseRef.child('invoices')
    var newKey = invoiceRef.push().key;
    this.state.payer.map((student, id) => {
      if (student.joining) {
        siblingCount += 1
      }
    })
    this.state.payer.map((student, id) => {
    if (student.joining) {
      dispatch(actions.updateTrialRegistration(student.id))
      let response = dispatch(actions.addTrialStudent(student))
      if (response !== undefined) {
        var termsPaid = []
        var total = 0
        var earlyBird = false
        var perSession;
        var siblingDiscount = false
        var payerTerm = []
        var siblingDiscountAmount = 0
        var paidSessions = 0
        this.state.selectedTermDates[id].map((term,termId) => {
            var paymentTerm = [];
            term.map((date) => {
              var index = _.findIndex(this.state.deselectedTermDates[id], (d) => { return moment(d).isSame(date)});
              if (index === -1) {
                paymentTerm.push(date)
              }
            })
            if (paymentTerm.length !== 0) {
              payerTerm[termId] = paymentTerm
              paidSessions += paymentTerm.length
            }
          })
          var totalSession = 0
         payerTerm.map((term, termId) => {
          var cost = 0
          switch (_.size(term)) {
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
              perSession = 22;
              break;
            default:
              cost = term.length * (paidSessions > 8 ? 35 : 45);
              perSession = paidSessions > 8 ? 35 : 45;
              break;
          }
          totalSession += _.size(term)
          total += cost
          var actualTerm;
          Object.keys(calendars).map((calendarKey) => {
            var calendar = calendars[calendarKey]
            if(calendar.key === this.state.calendarKeys[id]) {
              actualTerm = calendar.terms[termId]
            }
          })
          if (term.length === actualTerm.length && moment().isBefore(actualTerm[0])) {
            earlyBird= true
            total -= 20
          }

          if (id > 0 && term.length >= 5 && siblingCount >= 2) {
            siblingDiscount=true
            siblingDiscountAmount += 20
            total -= 20
          }
          var datesPaid = []
          term.map((date) => {
            datesPaid.push({
              date,
              perSession
            })
          })
          termsPaid[termId] = datesPaid
        })
        total += 80
        if (this.state.form === 'Cash') {
          var paymentDetail = {
            centreId : student.venueId.toString(),
            childKey : response.student.key,
            childName : student.childName,
            ageGroup : student.ageGroup,
            earlyBird,
            date: moment(this.state.receivedDate).format(),
            siblingDiscount,
            siblingDiscountAmount: siblingDiscount ? siblingDiscountAmount : null,
            total : total,
            termsPaid,
            paymentMethod: this.state.form,
            email: this.state.email,
            registration : true,
            jerseyIssued : false,
            invoiceKey: newKey
          }
        }
        else if (this.state.form === "Cheque") {
            var paymentDetail = {
              centreId : student.venueId.toString(),
              childKey : response.student.key,
              childName : student.childName,
              ageGroup : student.ageGroup,
              earlyBird,
              date: moment(this.state.receivedDate).format(),
              siblingDiscount,
              siblingDiscountAmount: siblingDiscount ? siblingDiscountAmount : null,
              total : total,
              termsPaid,
              paymentMethod: this.state.form,
              chequeNumber: document.getElementById('chequeNumber').value,
              email: this.state.email,
              registration: true,
              jerseyIssued: false,
              invoiceKey: newKey
            }
          }
          else if (this.state.form === "Bank Transfer") {
              var paymentDetail = {
                centreId : student.venueId.toString(),
                childKey : response.student.key,
                childName : student.childName,
                ageGroup : student.ageGroup,
                earlyBird,
                date: moment(this.state.receivedDate).format(),
                siblingDiscount,
                siblingDiscountAmount: siblingDiscount ? siblingDiscountAmount : null,
                total : total,
                termsPaid,
                paymentMethod: this.state.form,
                email: this.state.email,
                registration: true,
                jerseyIssued: false,
                invoiceKey: newKey
              }
            }
        dispatch(actions.addPayment(paymentDetail))
        paymentDetails.push(paymentDetail)
      }}
      })

    var invoiceHTML = InvoiceTemplate.render(paymentDetails);
    SendMail.mail(this.state.email, 'First Kick Academy - Payment Receipt', invoiceHTML)
    browserHistory.push('/m/jersey/');

}

componentDidMount () {
  window.scrollTo(0, 0)
}

  componentWillMount() {
    var {calendars, selection, register} = this.props;
    //Initiate Payer
    var payer = register;
    this.setState({payer: register});

    //Initiate Selectable Term Dates
    var calendarDates = [];
    var startDates = [];
    var calendarKeys = [];
    payer.map((child, id) => {

      var calendarKey = getCalendarKey(child, selection.classes)
      var currentTerm = getTerm(calendars, selection.key, moment())
      var calendar = calendars[calendarKey]
      var startDate = moment(calendar.terms[currentTerm][0])
      var calendarDate = getCalendarDates(calendar)

      startDates[id] = startDate;
      calendarDates[id] = calendarDate;
      calendarKeys[id] = calendarKey;
    })

    this.setState({calendarKeys})
    this.setState({calendarDates})
    this.setState({startDate : startDates});

}
  render() {
    var {calendars} = this.props;
    //Render Tabs
    var tabs = [];
    var fees = [];
    var totalFee = 0;
    var email = ''
    var count = 0
    var siblingCount = 0
    this.state.payer.map((student,id) => {
      if (student.joining) {
        siblingCount += 1
      }
    })
    this.state.payer.map((student, id) => {
      if (student.joining) {
        email = student.email
        tabs.push(<Tab eventKey={count} key={id} title={student.childName}>
           <Row style={{padding: '10px 20px'}}>
             <Col xs={12} md={12}>
               <FormGroup style={{marginBottom: '0'}}>
                 <ControlLabel>Start Date</ControlLabel>
                   <DatePicker
                     id = {"datePicker"+ id}
                     dateFormat="YYYY-MM-DD"
                     selected={this.state.startDate[id]}
                     includeDates={this.state.calendarDates[id]}
                     onChange={(e) => {
                           this.handleChange(moment(e), id)}}
                     />
               </FormGroup>
             </Col>
          </Row>
          <Row style={{padding: '5px 15px'}}>
            <Col>
              <PaymentDatesSelector key={id}
                startDate = {this.state.startDate[id]}
                calendarKey={this.state.calendarKeys[id]} calendarDates={this.state.calendarDates[id]}
                deselected={this.state.deselectedTermDates[id]}
                onChange={this.handleDatesChange.bind(this)}
                onDeselect={this.handleDeSelected.bind(this)}
                student = {student}
                payerId = {id} />
            </Col>
          </Row>
        </Tab>)
        count += 1;
        fees.push(<Row key={"Name"+id} style={{padding: '0px 15px', marginTop: '15px'}}>
          <Col xs={12} md={12} style={{borderBottom: '1px solid #bcbcbc'}}><p style={{fontWeight: '800', marginBottom: '0px'}}><Glyphicon glyph="user" /> {student.childName}</p></Col></Row>)
        var payerTerm = []
        var paidSessions = 0
        if (this.state.selectedTermDates[id] !== undefined) {
          this.state.selectedTermDates[id].map((term,termId) => {
            var paymentTerm = [];
            term.map((date) => {
              var index = _.findIndex(this.state.deselectedTermDates[id], (d) => { return moment(d).isSame(date)});
              if (index === -1) {
                paymentTerm.push(date)
              }
            })
            if (paymentTerm.length !== 0) {
              paidSessions += paymentTerm.length
              payerTerm[termId] = paymentTerm
            }
          })
        }

        if (payerTerm !== undefined) {
          var totalSession = 0
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
                cost = term.length * (paidSessions > 8? 35: 45);
                break;
            }
            totalSession += term.length
            var datehtml = []
            term.map((date, dateId) => {
              if (dateId === 0) {
                datehtml.push(<font key={date} style={{fontSize: '9px'}}><i>{moment(date).format("D MMM")}</i></font>)
              }
              else {
                datehtml.push(<font key={date} style={{fontSize: '9px'}}><i>, {moment(date).format("D MMM")}</i></font>)
              }
            })

            //Term Fee
            fees.push(<Row key={student.childName+termId} style={{padding: '0px 15px', marginTop: '5px', marginBottom:'5px', lineHeight: '12px'}}>
              <Col xs={8} md={8}><b>Term {termId}</b> ({term.length} sessions)</Col>
              <Col xs={4} md={4} style={{textAlign: 'right'}}>${cost}</Col>
              <Col xs={12} md={12} style={{marginTop: '0px'}}>{datehtml}</Col>
            </Row>)


            //Early Bird Discount
            var actualTerm;
            Object.keys(calendars).map((calendarKey) => {
              var calendar = calendars[calendarKey]
              if(calendar.key === this.state.calendarKeys[id]) {
                actualTerm = calendar.terms[termId]
              }
            })
            if (term.length === actualTerm.length && moment().isBefore(actualTerm[0])) {
              fees.push(<Row key={"earlybird"+termId+student.childName} style={{padding: '0px 15px', marginBottom: '5px'}}>
                <Col xs={8} md={8}><b style={{color: '#1796d3'}}>Early Bird Discount</b></Col>
                <Col xs={4} md={4} style={{float: 'right'}}><p style={{textAlign:'right', marginBottom: '0px'}}>($20)</p></Col>
              </Row>)
              totalFee -= 20;
            }
            //Sibling Discount
            if (id >= 1 && term.length >= 5 && siblingCount >= 2) {
              fees.push(<Row key={"siblingdiscount"+student.childName} style={{padding: '0px 15px', marginBottom: '5px'}}>
                <Col xs={8} md={8}><b style={{color: '#1796d3'}}>Sibling Discount</b></Col>
                <Col xs={4} md={4} style={{float: 'right'}}><p style={{textAlign:'right', marginBottom: '0px'}}>($20)</p></Col>
              </Row>)
              totalFee -= 20;
            }

            totalFee += cost;
          })

        }
        //Deposit
        if (student.deposit !== undefined) {
          if (student.deposit !== "0"){
            fees.push(<Row key={"deposit"+student.childName} style={{padding: '0px 15px', marginBottom: '5px'}}>
              <Col xs={8} md={8}><b style={{color: '#1796d3'}}>Deposit</b></Col>
              <Col xs={4} md={4} style={{float: 'right'}}><p style={{textAlign:'right', marginBottom: '0px'}}>(${student.deposit})</p></Col>
            </Row>)
            totalFee -= student.deposit;
          }

        }
        //Registration Fee
        fees.push(<Row key={"registration"+student.childName} style={{padding: '0px 15px', marginBottom: '5px'}}>
          <Col xs={8} md={8}><b>Registration Fee</b></Col>
          <Col xs={4} md={4} style={{float: 'right'}}><p style={{textAlign:'right', marginBottom: '0px'}}>$80</p></Col>
        </Row>)
        totalFee += 80;



      }
    })


    var formhtml = []
    var chequeClass = 'datebtn'
    var cashClass = 'datebtn'
    var bankTransferClass = 'datebtn'
    if (this.state.form === 'Cheque') {
      formhtml.push(<Row key={'cheque'} style={{marginTop: '15px', textAlign: 'center'}}>
       <Col md={6} xs={6}>
         <ControlLabel>Amount Collected</ControlLabel>
         <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
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
               style={{textAlign: 'center'}}
               id = "paymentDatePicker"
               dateFormat="DD-MM-YYYY"
               selected={this.state.receivedDate}
               onChange={(e) => {
                     this.handleReceivedDate(moment(e))}}
               />
         </FormGroup>
       </Col>
       <Col md={6} xs={6}>
         <FormGroup validationState={this.state.errorID}>
           <ControlLabel>Cheque No.</ControlLabel>
             <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
              autoFocus
             id="chequeNumber"
             type="text"
             placeholder="Enter Cheque No."/>
           <HelpBlock>{this.state.errorMessage}</HelpBlock>
         </FormGroup>
         <FormGroup validationState={this.state.emailError}>
         <ControlLabel>Email</ControlLabel>
              <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={email}
              />
            <HelpBlock>{this.state.emailErrorMessage}</HelpBlock>
          </FormGroup>
       </Col>
       <Col md={12} xs={12}>
         <button className='submitbtn'
           onClick={this.checkValid.bind(this)}>Payment Collected</button>
       </Col>
      </Row>)
      chequeClass = 'downbtn'

    }
    else if (this.state.form === 'Bank Transfer') {
      formhtml.push(<Row key={'banktransfer'} style={{marginTop: '15px', textAlign: 'center'}}>
       <Col md={6} xs={6}>
         <ControlLabel>Amount Collected</ControlLabel>
         <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
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
               style={{textAlign: 'center'}}
               id = "paymentDatePicker"
               dateFormat="DD-MM-YYYY"
               selected={this.state.receivedDate}
               onChange={(e) => {
                     this.handleReceivedDate(moment(e))}}
               />
         </FormGroup>
         <FormGroup validationState={this.state.emailError}>
         <ControlLabel>Email</ControlLabel>
              <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={email}
              />
            <HelpBlock>{this.state.emailErrorMessage}</HelpBlock>
          </FormGroup>
       </Col>
       <Col md={12} xs={12}>
         <button className='submitbtn'
           onClick={this.checkValid.bind(this)}>Payment Collected</button>
       </Col>
      </Row>)
      bankTransferClass = 'downbtn'

    }
    else if (this.state.form === 'Cash') {
      formhtml.push(<Row key={'amount'} style={{marginTop: '15px', textAlign: 'center'}}>
        <Col md={6} xs={6}>
          <ControlLabel>Amount Collected</ControlLabel>
             <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
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
                style={{textAlign: 'center'}}
                id = "paymentDatePicker"
                dateFormat="DD-MM-YYYY"
                selected={this.state.receivedDate}
                onChange={(e) => {
                      this.handleReceivedDate(moment(e))}}
                />
          </FormGroup>
            <FormGroup validationState={this.state.emailError}>
             <ControlLabel>Email</ControlLabel>
                  <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
                  id="email"
                  type="text"
                  placeholder="Enter Email"
                  defaultValue={email}
                  />
                <HelpBlock>{this.state.emailErrorMessage}</HelpBlock>
              </FormGroup>
        </Col>
          <Col md={12} xs={12}>
            <button className='submitbtn' onClick={this.checkValid.bind(this)}>Payment Collected</button>
          </Col>
      </Row>)
      cashClass = 'downbtn'
    }

    let close = () => this.setState({show:false})
    var modalMessage = '';

    if (this.state.form !== '') {
      var chequeNumber = 0;
      if (document.getElementById('chequeNumber') !== null) {
        chequeNumber = document.getElementById('chequeNumber').value
      }
      if (this.state.form === 'Cash') {
        modalMessage = 'Did you receive cash payment of $'+totalFee+' ?'
      }
      else if (this.state.form === 'Bank Transfer') {
        modalMessage = 'Did you receive bank transfer of $'+totalFee+' ?'
      }
      else {
        modalMessage = 'Did you receive cheque payment of $'+totalFee+' with cheque #' +chequeNumber + ' ?'
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
            <Modal.Title id="contained-modal-title">Payment Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMessage}
          </Modal.Body>
          <Modal.Footer>
            <Button bsSize='large' onClick={this.formSubmit.bind(this)}>Yes</Button>
            <Button bsSize='large' onClick={close}>No</Button>
          </Modal.Footer>
       </Modal>
       <Row>
         <Col md={12} xs={12}>
           <Tabs style={{marginTop:'5px', fontWeight:'600'}}   defaultActiveKey={0} id="uncontrolled-tab-example">
            {tabs}
          </Tabs>
         </Col>
       </Row>
       <Row>
         <Col md={12} xs={12}>
           <Panel header={<font style={{fontSize: '16px', fontWeight: 'bold'}}>Fees Breakdown</font>} footer={<Row style={{paddingRight:'15px'}}>
             <Col xs={8} md={8}><font style={{fontSize: '16px', fontWeight: 'bold'}}>Total:</font></Col>
             <Col xs={4} md={4}><font style={{fontSize: '16px', fontWeight: 'bold', float: 'right', textDecoration: 'underline'}}>${totalFee}</font></Col>
           </Row>}>
              {fees}
           </Panel>
         </Col>
       </Row>
       <Row>
         <Col md={12} xs={12}>
           <Panel header={<font style={{fontSize: '16px', fontWeight: 'bold'}}>Payment Method</font>}>
             <button className={cashClass} onClick={(e) => { this.handleForm(e, "Cash")}} style={{width: "30%", height: "50px"}}>Cash</button>
             <button className={chequeClass} onClick={(e) => { this.handleForm(e, "Cheque")}} style={{width: "30%", height: "50px"}}>Cheque</button>
             <button className={bankTransferClass} onClick={(e) => { this.handleForm(e, "Bank Transfer")}} style={{width: "30%", height: "50px"}}>Bank Transfer</button>
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

 export default connect((state) => {return state;
})(TrialPaymentForm);
