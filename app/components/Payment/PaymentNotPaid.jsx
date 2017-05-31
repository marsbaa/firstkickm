import React from 'react';
import {Link} from 'react-router'
import {Row, Col, FormGroup, FormControl, Badge, ProgressBar,Label} from 'react-bootstrap'
import {connect} from 'react-redux';
import PaymentClassList from 'PaymentClassList'
import SMSModal from 'SMSModal'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import _ from 'lodash'
import moment from 'moment'

class PaymentNotPaid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: 3,
      selectedYear : moment().year(),
      show: false
    }
  }

  handleSelect(e) {
    this.setState({selectedTerm : e.target.value})
  }

  handleSelectYear(e) {
    e.preventDefault()
    this.setState({year : e.target.value})
  }

  open() {
    this.setState({show: true})
  }

  close() {
    this.setState({show: false})
  }

  componentDidMount () {
    var {dispatch, selection, calendars} = this.props;
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        var terms = calendar.terms;
        terms.map((term, id) => {
          if(moment().isBetween(term[0], term[term.length-1], null, '[]')) {
            document.getElementById('termSelect').value = id
            this.setState({selectedTerm: id})
          }
        })
      }
    })
    dispatch(actions.updateNavTitle("/m/payment/notpaid", selection.name+" Not Paid List"));
  }


  render() {
    var {selection, calendars, students} = this.props;
    var classes = selection.classes
    var html = []
    var contacts = ''
    Object.keys(classes).forEach((classKey)=> {
      var {day, startTime, endTime, ageGroup, calendarKey} = classes[classKey]
      var classDayTime = ageGroup + " " + _.capitalize(day) + " " + startTime + " - " + endTime
      var calendar = _.find(calendars, {key : calendarKey})
      var termDates = []
      var unpaid = []
      calendar.terms[this.state.selectedTerm].map((date) => {
        termDates.push(date)
      })
      var filteredStudents = StudentsFilter.filter(students, selection.id, '')
      filteredStudents = _.filter(filteredStudents, {'ageGroup': ageGroup})
      filteredStudents = _.filter(filteredStudents, (o) => {return o.currentClassDay.toLowerCase() === day.toLowerCase()})
      filteredStudents = _.filter(filteredStudents, {'currentClassTime': startTime+' - '+endTime })
      Object.keys(filteredStudents).map((studentId) => {
        var student = filteredStudents[studentId]
        var attended = false
        var paid = false
        termDates.map((date) => {
          var dateId = moment(date).format("YYYY-MM-DD")
          if (student.attendance !== undefined) {
            if (student.attendance[dateId] !== undefined) {
              if (student.attendance[dateId].attended) {
                attended = true
              }
            }
          }
          var payment = _.find(student.payments, (o) => {
            if (o.termsPaid !== undefined) {
              return o.termsPaid[this.state.selectedTerm] !== undefined }
            return false
          })
          if (payment !== undefined) {
            if (_.find(payment.termsPaid[this.state.selectedTerm], (o) => {return moment(o.date).isSame(dateId, 'day')}) !== undefined) {
              paid = true
            }
          }
        })
        if (attended && !paid) {
          if (student.contact!== '' && student.contact!== undefined) {
            contacts = contacts + "65"+ student.contact + ";"
          }
          unpaid.push(student)
        }
      })
      if (_.size(unpaid) !== 0){
        html.push(<PaymentClassList key={classKey} group={unpaid} title={classDayTime} />)
      }
    })

    var termOptions = []
    var terms;
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        terms = calendar.terms;
        terms.map((term, id) => {
          termOptions.push(<option key={selection.key+id} value={id}>Term {id}</option>)
        })
      }
    })
    var yearOptions = [];
    yearOptions.push(<option key={moment().year()} value={moment().year()}>{moment().year()}</option>);
    yearOptions.push(<option key={moment().year()-1} value={moment().year()-1}>{moment().year()-1}</option>);

    let close = () => this.setState({show: false})
    var message = `<FKA> - Dear Parents,
Please be reminded to make term 3 payment this weekend if you have not made any payment.
If you would like to pay by Internet banking transfer, please screen shot your payment proof and send to our number through sms or whatsapp at +6591010666.  Our bank account is OCBC bank account no 526-286570-001
Thank you
FKA-Admin`
      
   return (
     <div>
        <SMSModal showModal={this.state.show} closeModal={this.close.bind(this)} title="SMS Payment Reminder" message={encodeURIComponent(message)} contacts={contacts}/>
        <Row style={{backgroundColor: '#ffc600', color: '#656565', padding: '15px 15px 5px 15px'}}>
          <Col xs={3} md={3} lg={3} style={{paddingRight: '2px'}}>
          <FormGroup>
            <FormControl style={{padding: '6px 6px 5px 2px'}}
              id="yearSelect" componentClass="select" placeholder="select" defaultValue={this.state.selectedYear} onChange={this.handleSelectYear.bind(this)}>
              {yearOptions}
            </FormControl>
          </FormGroup>
        </Col>
         <Col xs={3} md={3} lg={3} style={{paddingLeft: '0px', paddingRight: '2px'}}>
           <FormGroup>
            <FormControl id="termSelect" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)} style={{padding: '6px 2px 5px 2px'}}>
              {termOptions}
            </FormControl>
          </FormGroup>
         </Col>
         <Col xs={6} md={6} lg={6} style={{paddingLeft: '0px'}}>
           <button className="btn" style={{float: 'right', height: '34px', marginRight: '2px'}} onClick={()=>this.setState({show: true})}>Send Reminder</button>

         </Col>
       </Row>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(PaymentNotPaid);
