import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import moment from 'moment'
import StudentsFilter from 'StudentsFilter'
import {Link} from 'react-router'
import PayerNotPaid from 'PayerNotPaid'
import {Row, Col} from 'react-bootstrap'


class PaymentClassList extends React.Component {

  render() {
    var {calendars, students, selection} = this.props
    var checkedAll = this.props.checkedAll
    var {day, startTime, endTime, ageGroup, termKey} = this.props.classes
    var classDayTime = ageGroup + " " + _.capitalize(day) + " " + startTime + " - " + endTime
    var calendar = _.find(calendars, {key : termKey})
    var termDates = []
    var unpaid = []
    calendar.terms[this.props.selectedTerm].map((date) => {
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
            return o.termsPaid[this.props.selectedTerm] !== undefined }
          return false
        })
        if (payment !== undefined) {
          if (_.find(payment.termsPaid[this.props.selectedTerm], (o) => {return moment(o.date).isSame(dateId, 'day')}) !== undefined) {
            paid = true
          }
        }
      })
      if (attended && !paid) {
        unpaid.push(student)
      }
    })
    var html = []
    if (_.size(unpaid) !== 0) {
      html.push(
        <Row key={classDayTime} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
           <Col xs={12} md={12}>
             <h5>{classDayTime}</h5>
          </Col>
         </Row>
        )
      unpaid.map((student, key) => {
        html.push(<PayerNotPaid key={key} student={student} checked={checkedAll}/>)
      })
    }



     return (
       <div>
         {html}
       </div>
     );
   }
  }

 export default connect((state) => {return state;
})(PaymentClassList);
