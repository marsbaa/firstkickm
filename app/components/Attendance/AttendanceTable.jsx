import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import moment from 'moment'
import {Glyphicon} from 'react-bootstrap'
import StudentsFilter from 'StudentsFilter'
import {Link} from 'react-router'


class AttendanceTable extends React.Component {

  render() {
    var {calendars, students, selection} = this.props
    var {day, startTime, endTime, ageGroup, calendarKey} = this.props.classes
    var classDayTime = ageGroup + " " + _.capitalize(day) + " " + startTime + " - " + endTime
    var calendar = _.find(calendars, {key : calendarKey})
    var termDates = []
    calendar.terms[this.props.selectedTerm].map((date) => {
      termDates.push(date)
    })
    var data = []
    var termColumns = termDates.map((date, id) => {
      return {
        header: <b style={{fontSize: '9px'}}>{moment(date).format("DD/MM")}</b>,
        accessor: "status["+id+"]",
        maxWidth: 35
      }
    })
    var filteredStudents = StudentsFilter.filter(students, selection.id, '')
    filteredStudents = _.filter(filteredStudents, {'ageGroup': ageGroup})
    filteredStudents = _.filter(filteredStudents, (o) => {return o.currentClassDay.toLowerCase() === day.toLowerCase()})
    filteredStudents = _.filter(filteredStudents, {'currentClassTime': startTime+' - '+endTime })
    Object.keys(filteredStudents).map((studentId) => {
      var termData = []
      var student = filteredStudents[studentId]
      termDates.map((date) => {
        var dateId = moment(date).format("YYYY-MM-DD")
        var attended = ''
        var paid = false
        if (student.attendance !== undefined) {
          if (student.attendance[dateId] !== undefined) {
            if (student.attendance[dateId].attended) {
              attended = 'attended'
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
        if (moment().isAfter(dateId)) {
          if (paid & attended !== 'attended') {
            attended = 'notattended'
          }
        }
        termData.push(<div style={{
            width: '100%',
            height: '100%',
            backgroundColor: paid ? 'green' : 'none',
            textAlign: 'center',
            color: 'white',
            fontSize: '9px'
          }}>
          { attended === 'attended' ? <Glyphicon glyph="ok" style={{color: !paid? 'red': 'white'}}/> : attended === 'notattended' ? <Glyphicon glyph="remove" /> : <Glyphicon glyph="minus" />}
        </div>)
      })
      data.push({
        childName: <Link to={"/m/students/edit/"+student.key}>{student.childName}</Link>,
        paymentButton: <Link className="innerbtn" style={{fontSize: '7px'}} to={"/m/payment/collection/"+student.key}>$</Link>,
        status : termData
      })
    })


    const columns = [{
      header: <b style={{fontSize: '14px'}}>{classDayTime}</b>,
      columns: [{
        header: <b style={{fontSize: '9px'}}>Child Name</b>,
        accessor: 'childName',
        maxWidth: 80,
        style: {fontSize: '8px'}
      },
      {
        header: <b style={{fontSize: '9px'}}>P</b>,
        accessor: 'paymentButton',
        maxWidth: 30,
        style: {fontSize: '8px'}
      },
      ...termColumns
      ]
    }]
     return (
       <div>
         <ReactTable
           showPagination={false}
           data ={data}
           resizable = {false}
           columns={columns}
           pageSize={_.size(filteredStudents)}
           />
       </div>

     );
   }
  }

 export default connect((state) => {return state;
})(AttendanceTable);
