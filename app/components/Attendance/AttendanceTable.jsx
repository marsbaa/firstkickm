import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import moment from 'moment'
import {Glyphicon} from 'react-bootstrap'
import StudentsFilter from 'StudentsFilter'

class AttendanceTable extends React.Component {

  render() {
    var {calendars, students, selection} = this.props
    var {day, startTime, endTime, ageGroup, termKey} = this.props.classes
    var classDayTime = ageGroup + " " + _.capitalize(day) + " " + startTime + " - " + endTime
    var calendar = _.find(calendars, {key : termKey})
    var termDates = []
    calendar.terms[this.props.selectedTerm].map((date) => {
      termDates.push(date)
    })
    var termColumns = termDates.map((date, id) => {
      return {
        header: <b style={{fontSize: '8px'}}>{moment(date).format("DD/MM")}</b>,
        accessor: "termDates["+id+"]",
        maxWidth: 35,
        style: {fontSize: '10px', textAlign: 'center', alignItems: 'center', color: 'white'}
      }
    })
    var data = []
    var filteredStudents = StudentsFilter.filter(students, selection.id, '')
    filteredStudents = _.filter(filteredStudents, {'ageGroup': ageGroup})
    filteredStudents = _.filter(filteredStudents, (o) => {return o.currentClassDay.toLowerCase() === day.toLowerCase()})
    filteredStudents = _.filter(filteredStudents, {'currentClassTime': startTime+' - '+endTime })
    Object.keys(filteredStudents).map((studentId) => {
      var termData = []
      var student = filteredStudents[studentId]
      if (student.attendance !== undefined) {
        termDates.map((date) => {
          var dateId = moment(date).format("YYYY-MM-DD")
          if (student.attendance[dateId] !== undefined) {
            if (student.attendance[dateId].attended) {
              termData.push(<div style={{width: '25px', height: '15px', backgroundColor: 'green'}}><Glyphicon glyph="ok-sign"/></div>)
            }
          }
          else {
            termData.push(<div></div>)
          }
        })
      }
      data.push({
        childName: student.childName,
        termDates : termData
      })
    })


    const columns = [{
      header: <b style={{fontSize: '14px'}}>{classDayTime}</b>,
      columns: [{
        header: <b style={{fontSize: '8px'}}>Child Name</b>,
        accessor: 'childName',
        maxWidth: 70,
        style: {fontSize: '8px'}
      }, ...termColumns
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
