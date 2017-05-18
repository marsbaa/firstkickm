import React from 'react';
import {Link} from 'react-router'
import {Row, Col, FormGroup, FormControl} from 'react-bootstrap'
import {connect} from 'react-redux';
import PayerReport from 'PayerReport'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import _ from 'lodash'
import moment from 'moment'

class PaymentReport extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: 3
    }
  }

  handleSelect(e) {
    console.log(e.target.value)
    this.setState({selectedTerm : e.target.value})
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
    dispatch(actions.updateNavTitle("/m/payment/report", selection.name+" Payment Report"));
  }


  render() {
    var {students, searchText, selection, calendars} = this.props;
    var html=[];
    var studentsPaid = 0
    var studentsUnPaid = 0
    var amountPaid = 0
    var amountUnPaid = 0
    var filteredStudents = _.filter(students, (o) => {
      if (o.venueId !== undefined) {
        return o.venueId.toString() === selection.id
      }
      });
    filteredStudents = _.filter(filteredStudents, (o) => {
      return !(o.status==='Not Active')})
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


          } )
          groupTime = _.groupBy(groupTime, 'currentClassTime');
          Object.keys(groupTime).forEach((timeSlot)=> {
            var groupAge = _.groupBy(groupTime[timeSlot], 'ageGroup');
            Object.keys(groupAge).forEach((age)=> {
              var group = groupAge[age];
              var paid = [];
              var unpaid = [];
              var paidDetails = []
              Object.keys(group).map((studentId) => {
                var student = group[studentId]
                var paidStudent = _.find(student.payments, (t) => {
                    if (t.termsPaid !== undefined) {
                      if (t.termsPaid[this.state.selectedTerm] !== undefined) {return true}
                      else {return false}
                    }
                  })


                if (paidStudent === undefined) {
                  unpaid.push(student)
                }
                else {
                  paid.push(student)
                  paidDetails.push(paidStudent)
                }
              })
              if (_.size(paid) !== 0) {
                var amount =_.reduce(paidDetails, (sum, n) => {
                  return sum + parseInt(n.total);
                  }, 0)
                html.push( <Row key={"paidlist"+age+timeSlot} style={{backgroundColor: 'Green', padding: '0px 15px', color: '#ffc600'}}>
                   <Col xs={8} md={8}>
                     <h5>PAID - {age} {timeSlot}</h5>
                   </Col>
                     <Col xs={4} md={4} style={{textAlign: 'center'}}>
                       <h5>{_.size(paid)} Paid: ${amount}</h5>
                   </Col>
                 </Row>);
                 Object.keys(paid).forEach((paidId) => {
                     html.push(<PayerReport key={paid[paidId].key} student={paid[paidId]}/>);
                 })
                 studentsPaid += _.size(paid)
                 amountPaid += amount
              }
              if (_.size(unpaid) !== 0) {
                html.push( <Row key={"unpaidlist"+age+timeSlot} style={{backgroundColor: 'Red', padding: '0px 15px', color: '#ffc600'}}>
                   <Col xs={8} md={8}>
                     <h5>UNPAID - {age} {timeSlot}</h5>
                   </Col>
                     <Col xs={4} md={4} style={{textAlign: 'center'}}>
                       <h5>{_.size(unpaid)} Unpaid</h5>
                   </Col>
                 </Row>);
                 Object.keys(unpaid).forEach((unpaidId) => {
                     html.push(<PayerReport key={unpaid[unpaidId].key} student={unpaid[unpaidId]}/>);
                 })
                 studentsUnPaid += _.size(unpaid)
                 amountUnPaid += _.size(unpaid) * 280
              }
            })
          })
        })
      }
    html.push( <Row key={"studentsPaid"} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
       <Col xs={8} md={8}>
         <h4>No. of Students Paid</h4>
       </Col>
         <Col xs={4} md={4} style={{textAlign: 'center'}}>
           <h4>{studentsPaid}</h4>
       </Col>
     </Row>);
     html.push( <Row key={"amountPaid"} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
        <Col xs={8} md={8}>
          <h4>Total Amount Paid</h4>
        </Col>
          <Col xs={4} md={4} style={{textAlign: 'center'}}>
            <h4>${amountPaid}</h4>
        </Col>
      </Row>);
     html.push( <Row key={"studentsUnPaid"} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
        <Col xs={8} md={8}>
          <h4>No. of Students Not Paid</h4>
        </Col>
          <Col xs={4} md={4} style={{textAlign: 'center'}}>
            <h4>{studentsUnPaid}</h4>
        </Col>
      </Row>);
      html.push( <Row key={"amountUnPaid"} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
         <Col xs={8} md={8}>
           <h4>Potential Amount from Unpaid</h4>
         </Col>
           <Col xs={4} md={4} style={{textAlign: 'center'}}>
             <h4>${amountUnPaid}</h4>
         </Col>
       </Row>);
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


   return (
     <div>
       <Row>
         <Col xs={12} md={12}>
           <FormGroup>
            <FormControl id="termSelect" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}>
              <option value="select">select</option>
              {termOptions}
            </FormControl>
          </FormGroup>
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(PaymentReport);
