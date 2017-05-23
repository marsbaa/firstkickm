import React from 'react';
import {Link} from 'react-router'
import {Row, Col, Modal, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'
import {connect} from 'react-redux';
import Payer from 'Payer'
var actions = require('actions');
import {RadioGroup, Radio} from 'react-radio-group'
import DatePicker from 'react-datepicker'
require('react-datepicker/dist/react-datepicker.css')
import StudentsFilter from 'StudentsFilter'
import InvoiceTemplateOthers from 'InvoiceTemplateOthers'
import {firebaseRef} from 'app/firebase'
import Search from 'Search'
import _ from 'lodash'
import moment from 'moment'

class PaymentList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      childKey : '',
      childName: '',
      email: '',
      paymentMethod: 'Cash',
      receivedDate: moment()
    }
  }

  handleChange(value) {
    this.setState({paymentMethod: value})
  }

  handleReceivedDate(date) {
    this.setState({
      receivedDate: date
    });
  }

  formSubmit() {
    var {dispatch, users, auth, selection, students} = this.props
    var user = _.find(users, ['email', auth.email])
    var invoiceRef = firebaseRef.child('invoices')
    var newKey = invoiceRef.push().key;
    var payment = {
      paymentDescription: document.getElementById('description').value,
      total: parseInt(document.getElementById('amount').value),
      date : moment(this.state.receivedDate).format(),
      centreId : selection.id,
      childKey: this.state.childKey,
      childName: this.state.childName,
      paymentMethod: this.state.paymentMethod,
      invoiceKey: newKey
    }
    console.log(payment)
    dispatch(actions.addPayment(payment))
    var invoiceHTML = InvoiceTemplateOthers.render(payment)
    var updates = {}
    updates[newKey] = {invoiceHTML}
    invoiceRef.update(updates)
    SendMail.mail(this.state.email, 'First Kick Academy - Payment Receipt', invoiceHTML)
    this.setState({show: false})

  }

  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/payment", selection.name+" Payment"));
  }

  onShow(e, key, childName, email) {
    e.preventDefault()
    this.setState({show: true, childKey: key, childName, email})
  }

  render() {
    var {students, searchText, selection} = this.props;
    var html=[];
    var filteredStudents = StudentsFilter.filter(students, selection.id, searchText);
    filteredStudents = _.filter(filteredStudents, (o) => {
      return !(o.status==='Not Active')})
    var actualStudents = StudentsFilter.filter(students, selection.id, "");
    if (filteredStudents.length !== 0) {
      var groupDay = _.groupBy(filteredStudents, (o) => {
        return o.currentClassDay.toLowerCase()
      });
      Object.keys(groupDay).forEach((day) => {
          var groupTime = _.orderBy(groupDay[day], (o) => {
              var timeSplit = o.currentClassTime.split(' - ')
              var endTime = timeSplit[1].split(':')
              if (endTime[1] === undefined) {
                endTime = timeSplit[1].split('.')
              }
              if (endTime[1].endsWith('pm')){
                endTime[0] = endTime[0]+12
              }
              endTime = endTime[0]+":"+endTime[1]
              return endTime
          })
      var groupTime = _.groupBy(groupTime, 'currentClassTime');
      var actualGroupTime = _.groupBy(actualStudents, 'currentClassTime')
      Object.keys(groupTime).forEach((timeSlot)=> {
        var groupAge = _.groupBy(groupTime[timeSlot], 'ageGroup');
        var actualGroupAge = _.groupBy(actualGroupTime[timeSlot], 'ageGroup');
        Object.keys(groupAge).forEach((age)=> {
          var group = groupAge[age];
          group = _.sortBy(group, ['childName'])
          var actualGroup = actualGroupAge[age];
          html.push( <Row key={"paymentlist"+age+timeSlot} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
             <Col xs={8} md={8}>
               <h5>{age} {timeSlot}</h5>
             </Col>
               <Col xs={4} md={4} style={{textAlign: 'center'}}>
                 <h5>Class Size: {_.size(actualGroup)}</h5>
             </Col>
           </Row>);

           Object.keys(group).forEach((studentId) => {
               html.push(<Payer key={group[studentId].key} student={group[studentId]} onShow= {this.onShow.bind(this)}/>);

           })
        })
      })
    })
    }

    let close = () => this.setState({show:false})

   return (
     <div>
       <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Collect Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
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
              <ControlLabel>Payment Description</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
                id="description"
                type="text"
                placeholder="Enter Payment Description"/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
                <FormControl style={{marginBottom: '10px'}}
                id="amount"
                type="text"
                placeholder="Enter Amount"/>
            </FormGroup>
            <RadioGroup name="fruit"
              style={{marginBottom: '10px'}} selectedValue={this.state.paymentMethod} onChange={this.handleChange.bind(this)}>
              <label style={{marginLeft: '5px'}}>
                <Radio value="Cash" />Cash
              </label>
              <label style={{marginLeft: '5px'}}>
                <Radio value="Cheque" />Cheque
              </label>
              <label style={{marginLeft: '5px'}}>
                <Radio value="Bank Transfer" />Bank Transfer
              </label>
            </RadioGroup>
            <FormGroup>
              <ControlLabel>Email for Receipt</ControlLabel>
                <FormControl style={{marginBottom: '10px'}}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={this.state.email}/>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsSize='large' onClick={this.formSubmit.bind(this)}>Yes</Button>
            <Button bsSize='large' onClick={close}>No</Button>
          </Modal.Footer>
       </Modal>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={12} md={12}>
           <Search type="student" />
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(PaymentList);
