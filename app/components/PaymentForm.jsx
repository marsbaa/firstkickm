import React from 'react'
import _ from 'lodash'
import {Tabs, Tab, Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Panel, Button} from 'react-bootstrap'
import btn from 'styles.css'
var actions = require('actions')
var {connect} = require('react-redux')
import DatePicker from 'react-datepicker'
require('react-datepicker/dist/react-datepicker.css')
import moment from 'moment'
import PaymentDatesSelector from 'PaymentDatesSelector'

class PaymentForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      payer : [],
      startDate: [],
      termDates: [],
      termKeys: [],
      numOfSession: [],
      promotion: 0,
      selectedTermDates: [],
      deselectedTermDates: [],
      form: ''
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

  formSubmit(e) {
    e.preventDefault()
    console.log("Paid")
  }

  componentWillMount() {
    var {students, calendars, centres, selection} = this.props;


    var centre;
    centres.map((c)=> {
      if (c.id === selection) {
        centre = c;
      }
    })

    //Initiate Payer
    var studentId = this.props.params.studentId;
    var contact = null;
    var payer = [];
    students.map((student) => {
      if (student.key === studentId) {
        contact = student.contact
        payer.push(student)
      }
    })
    students.map((student) => {
        if (student.contact === contact && student.key!== studentId){
          if (contact !== undefined) {
            payer.push(student)
          }
        }
      })
    this.setState({payer});

    //Initiate Selectable Term Dates
    var termDates = [];
    var startDates = [];
    var termKeys = [];
    payer.map((child, id) => {
      var termKey;
      Object.keys(centre.classes).forEach((classId) => {
          var cla = centre.classes[classId];
          if (cla.day.toLowerCase() === child.currentClassDay.toLowerCase()) {
            var classTime = cla.startTime +" - "+cla.endTime;
            if (classTime === child.currentClassTime) {
              termKey = cla.termKey
            }
          }
      })

      var startDate;
      var count = 0;
      var termDate = [];
      calendars.map((calendar) => {
        if(calendar.key === termKey) {
          calendar.terms.map((term, termId) => {
            term.map((date) => {
              if (moment(date) > moment() && count === 0) {
                startDate = moment(date);
                count += 1;
              }
              termDate.push(moment(date));
            })
          })
        }
      })
      startDates[id] = startDate;
      termDates[id] = termDate;
      termKeys[id] = termKey;
    })

    this.setState({termKeys})
    this.setState({termDates})
    this.setState({startDate : startDates});

}
  render() {
    var {calendars, selection, centres} = this.props;
    //Render Tabs
    var tabs = [];
    var fees = [];
    var totalFee = 0;
    this.state.payer.map((student, id) => {
      tabs.push(<Tab eventKey={id} key={student.key} title={student.childName}>
         <Row style={{padding: '10px 20px'}}>
           <Col xs={12} md={12}>
             <FormGroup style={{marginBottom: '0'}}>
               <ControlLabel>Start Date</ControlLabel>
                 <DatePicker style={{border: '1px solid black', fontWeight: 'normal'}}
                   id = {"datePicker"+ id}
                   dateFormat="YYYY-MM-DD"
                   selected={this.state.startDate[id]}
                   includeDates={this.state.termDates[id]}
                   onChange={(e) => {
                         this.handleChange(moment(e), id)}}
                   />
             </FormGroup>
           </Col>
        </Row>
        <Row style={{padding: '5px 20px'}}>
          <Col>
            <PaymentDatesSelector key={id}
              startDate = {this.state.startDate[id]}
              termKey={this.state.termKeys[id]} termDates={this.state.termDates[id]}
              deselected={this.state.deselectedTermDates[id]}
              onChange={this.handleDatesChange.bind(this)}
              onDeselect={this.handleDeSelected.bind(this)}
              payerId = {id} />
          </Col>
        </Row>
      </Tab>)
      fees.push(<Row key={"Name"+id} style={{paddingLeft: '10px'}}>
        <Col xs={8} md={8}><p style={{fontWeight: '800', textDecoration: 'underline'}}>{student.childName}</p></Col></Row>)
      var payerTerm = []
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
            payerTerm[termId] = paymentTerm
          }
        })
      }

      if (payerTerm !== undefined) {
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
              cost = term.length * 45;
              break;
          }
          var datehtml = []
          term.map((date, dateId) => {
            if (dateId === 0) {
              datehtml.push(<font key={date} style={{fontSize: '9px'}}><i>{moment(date).format("D MMM")}</i></font>)
            }
            else {
              datehtml.push(<font key={date} style={{fontSize: '9px'}}><i>, {moment(date).format("D MMM")}</i></font>)
            }
          })
          fees.push(<Row key={student.childName+termId} style={{padding: '0px 15px', marginTop: '5px', lineHeight: '12px'}}>
            <Col xs={8} md={8}><b>Term {termId}</b> ({term.length} sessions)</Col>
            <Col xs={4} md={4} style={{textAlign: 'right'}}>${cost}</Col>
            <Col xs={12} md={12} style={{marginTop: '0px'}}>{datehtml}</Col>
          </Row>)
          var actualTerm;
          calendars.map((calendar) => {
            if(calendar.key === this.state.termKeys[id]) {
              actualTerm = calendar.terms[termId]
            }
          })
          if (term.length === actualTerm.length && moment().isBefore(actualTerm[0])) {
            fees.push(<Row key={"earlybird"+termId+student.childName} style={{padding: '0px 15px', marginTop: '5px'}}>
              <Col xs={8} md={8}><b style={{color: '#1796d3'}}>Early Bird Discount</b></Col>
              <Col xs={4} md={4} style={{float: 'right'}}><p style={{textAlign:'right'}}>($20)</p></Col>
            </Row>)
            totalFee -= 20;
          }

          totalFee += cost;
        })

      }
      if (id >= 1) {
        fees.push(<Row key={"siblingdiscount"+student.childName} style={{padding: '0px 15px', marginTop: '5px'}}>
          <Col xs={8} md={8}><b style={{color: '#1796d3'}}>Sibling Discount</b></Col>
          <Col xs={4} md={4} style={{float: 'right'}}><p style={{textAlign:'right'}}>($20)</p></Col>
        </Row>)
        totalFee -= 20;
      }

    })

    var formhtml = []
    if (this.state.form === 'cheque') {
      formhtml.push(<Row key={'cheque'} style={{marginTop: '15px', textAlign: 'center'}}>
       <Col md={6} xs={6}>
         <ControlLabel>Amount Collected</ControlLabel>
         <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
         id="collectedAmount"
         type="text"
         placeholder="Enter amount collected (SGD$)"
         defaultValue={totalFee}
         />
       </Col>
       <Col md={6} xs={6}>
         <ControlLabel>Cheque No.</ControlLabel>
           <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
           id="chequeNumber"
           autoFocus
           type="text"
           placeholder="Enter Cheque No."/>
       </Col>
       <Col md={12} xs={12}>
         <Button style={{width: '100%', margin: '20px 0px'}} onClick={this.formSubmit.bind(this)}>Payment Collected</Button>
       </Col>
      </Row>)
    }
    else if (this.state.form === 'cash') {
      formhtml.push(<Row key={'amount'} style={{marginTop: '15px', textAlign: 'center'}}>
        <Col md={3} xs={3}></Col>
        <Col md={6} xs={6}>
          <ControlLabel>Amount Collected</ControlLabel>
             <FormControl style={{marginBottom: '10px', textAlign: 'center'}}
             id="collectedAmount"
             type="text"
             autoFocus
             placeholder="Enter amount collected (SGD$)"
             defaultValue={totalFee}
             />
        </Col>
        <Col md={3} xs={3}></Col>
          <Col md={12} xs={12}>
            <Button style={{width: '100%', margin: '20px 0px'}} onClick={this.formSubmit.bind(this)}>Payment Collected</Button>
          </Col>
      </Row>)
    }



   return (
     <Grid>
       <Row>
         <Col md={12} xs={12}>
           <Tabs style={{marginTop:'5px', fontWeight:'600'}} defaultActiveKey={0} id="uncontrolled-tab-example">
            {tabs}
          </Tabs>
         </Col>
       </Row>
       <Row>
         <Col md={12} xs={12}>
           <Panel header={<font style={{fontSize: '16px', fontWeight: 'bold'}}>Fees Breakdown</font>} footer={<Row style={{paddingRight:'20px'}}>
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
             <button onClick={(e) => { this.handleForm(e, "cash")}} style={{width: "45%", height: "50px"}} className="btn">Cash</button>
             <button onClick={(e) => { this.handleForm(e, "cheque")}} style={{width: "45%", height: "50px"}} className="btn">Cheque</button>
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
})(PaymentForm);
