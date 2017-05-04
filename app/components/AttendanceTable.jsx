import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import moment from 'moment'
import {Glyphicon} from 'react-bootstrap'

class AttendanceTable extends React.Component {

  render() {
    var {calendars} = this.props
    var {day, startTime, endTime, ageGroup, termKey} = this.props.classes
    var classDayTime = ageGroup + " " + _.capitalize(day) + " " + startTime + " - " + endTime
    var calendar = _.find(calendars, {key : termKey})
    var termDates = []
    calendar.terms[2].map((date) => {
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
    var data = [
      {
        childName: 'Ray Yee',
        termDates : [
          <div style={{width: '25px', height: '15px', backgroundColor: 'green'}}><Glyphicon glyph="ok-sign"/></div>,
          <div style={{width: '25px', height: '15px', backgroundColor: 'red'}}><Glyphicon glyph="ok-sign"/></div>,
          <div style={{width: '25px', height: '15px', backgroundColor: 'green'}}><Glyphicon glyph="remove-sign"/></div>,
          <div style={{width: '25px', height: '15px', backgroundColor: 'orange'}}><b>M</b></div>,
          'E', 'F', 'G', 'H']
      }
    ]

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
           />
       </div>

     );
   }
  }

 export default connect((state) => {return state;
})(AttendanceTable);
