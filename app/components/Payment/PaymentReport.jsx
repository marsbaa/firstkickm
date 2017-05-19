import React from 'react';
import {Link} from 'react-router'
import {Row, Col, FormGroup, FormControl, Badge, ProgressBar,Label} from 'react-bootstrap'
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
              html.push(
                <Row key={age+timeSlot+day} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
                   <Col xs={12} md={12}>
                     <h5>{age} {timeSlot} ({_.capitalize(day)})</h5>
                  </Col>
                 </Row>
                )
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
              const now = Math.round(_.size(paid) / _.size(group) * 100)

              if (_.size(paid) !== 0) {
                var amount =_.reduce(paidDetails, (sum, n) => {
                  return sum + parseInt(n.total);
                  }, 0)

                html.push(  <Row key= {"paidlist"+age+timeSlot+day} style={{backgroundColor: '#f5f5f5', padding: '10px 15px', borderBottom: '1px solid #cccccc', fontSize: '14px', fontWeight: '800'}}>
                    <Col xs={6} md={6}>
                      Paid <Badge>{_.size(paid)}</Badge>  Amount <Badge>${amount}</Badge>
                    </Col>
                    <Col xs={6} md={6}>
                      <ProgressBar striped active bsStyle="success" now={now} label={`${now}%`} style={{marginBottom: '0'}} />
                    </Col>
                  </Row> )

                 Object.keys(paid).forEach((paidId) => {
                     html.push(<PayerReport key={paid[paidId].key} student={paid[paidId]} selectedTerm={this.state.selectedTerm}/>);
                 })
                 studentsPaid += _.size(paid)
                 amountPaid += amount
              }
              if (_.size(unpaid) !== 0) {
                html.push( <Row key= {"unpaidlist"+age+timeSlot+day} style={{backgroundColor: '#f5f5f5', padding: '10px 15px', borderBottom: '1px solid #cccccc', fontSize: '14px', fontWeight: '800'}}>
                  <Col xs={6} md={6}>
                    Unpaid <Badge>{_.size(unpaid)}</Badge>
                  </Col>
                  <Col xs={6} md={6} style={{textAlign: 'right'}}>

                  </Col>

                 </Row>);
                 Object.keys(unpaid).forEach((unpaidId) => {
                     html.push(<PayerReport key={unpaid[unpaidId].key} student={unpaid[unpaidId]} selectedTerm={this.state.selectedTerm}/>);
                 })
                 studentsUnPaid += _.size(unpaid)
                 amountUnPaid += _.size(unpaid) * 280
              }
            })
          })
        })
      }

    html.push(
      <Row key={"studentsPaid"} style={{padding: '8px 20px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={12} md={12} lg={12}  style={{fontWeight: 'bold',textAlign:'right', fontSize: '16px'}}>
          <h4>Students (Paid) <Label>{studentsPaid}</Label></h4>
        </Col>
      </Row>
      )
    html.push(
      <Row key={"amountPaid"} style={{padding: '8px 20px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={12} md={12} lg={12} style={{fontWeight: 'bold',textAlign:'right', fontSize: '16px'}}>
          <h4>Total (Paid) <Label>${amountPaid}</Label></h4>
        </Col>
      </Row>
      )
      html.push(
        <Row key={"studentsUnPaid"} style={{padding: '8px 20px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={12} md={12} lg={12} style={{fontWeight: 'bold',textAlign:'right', fontSize: '16px'}}>
            <h4>Students (Unpaid) <Label>{studentsUnPaid}</Label></h4>
          </Col>
        </Row>
        )
      html.push(
        <Row key={"amountUnPaid"} style={{padding: '8px 20px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={12} md={12} lg={12}  style={{fontWeight: 'bold',textAlign:'right', fontSize: '16px'}}>
            <h4>Potential Total (Unpaid) <Label>${amountUnPaid}</Label></h4>
          </Col>
        </Row>
        )
        const nowPaid = Math.round(studentsPaid / (studentsPaid+studentsUnPaid) * 100)
        const nowUnPaid = Math.round(studentsUnPaid / (studentsPaid+studentsUnPaid) * 100)
        html.push(
          <Row key={"progressBar"} style={{padding: '8px 20px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
            <Col xs={12} md={12} lg={12}  style={{fontWeight: 'bold',textAlign:'right', fontSize: '16px'}}>
              <ProgressBar style={{marginBottom: '0'}}>
                <ProgressBar striped active bsStyle="success" now={nowPaid} label={`${nowPaid}%`} style={{marginBottom: '0'}} key={1}/>
                <ProgressBar striped active bsStyle="danger" now={nowUnPaid} label={`${nowUnPaid}%`} style={{marginBottom: '0'}} key={2} />
              </ProgressBar>
            </Col>
          </Row>
          )
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
        <Row style={{backgroundColor: '#ffc600', color: '#656565', padding: '15px 15px 5px 15px'}}>
         <Col xs={8} md={8} lg={8}>
           <FormGroup>
            <FormControl id="termSelect" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}>
              <option value="select">select</option>
              {termOptions}
            </FormControl>
          </FormGroup>
         </Col>
         <Col xs={4} md={8} lg={8}>
           <button className="btn" style={{float: 'right', height: '34px'}}>Send Reminder</button>
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(PaymentReport);
