import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
var actions = require('actions');
import CoachAttendee from 'CoachAttendee'
import CoachesFilter from 'CoachesFilter'
import Search from 'Search'
import _ from 'lodash'
import moment from 'moment'

class CoachAttendance extends React.Component{

  componentWillMount() {
    var {dispatch, coaches, coachSchedule} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
    }
    if (_.isEmpty(coachSchedule)) {
      dispatch(actions.startCoachSchedule());
    }
  }


  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/coachattendance", selection.name+" Coach Attendance"));
  }



  render() {
    var {coaches, searchText, selection, calendars, coachSchedule} = this.props;
    var filteredCoaches = CoachesFilter.filter(coaches, searchText)
    var today=-1;
    var html=[];
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        Object.keys(calendar.terms).map((termId) => {
          var term = calendar.terms[termId]
          term.map ((date)=> {
            if( moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
              today = 1;
            }
          })
        })
      }
    });
    if (today !== -1) {
      var classes = selection.classes
      Object.keys(classes).map((classId)=> {
        var {ageGroup, day, endTime, startTime} = classes[classId]
        var schedule = _.find(coachSchedule, {'classKey' : classId, 'date': moment().format('YYYYMMDD')})
        if (schedule != undefined) {
          if(_.size(schedule.assigned) != 0) {
            html.push(<Row key={classId} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
               <Col xs={12} md={12}>
                 <h5>{ageGroup} {startTime} - {endTime} ({day})</h5>
               </Col>
             </Row>)
             schedule.assigned.map((c) => {
               var coach = _.find(filteredCoaches, {'key': c.coachKey })
               console.log(coach)
               if (coach != undefined) {
                 html.push(<CoachAttendee key={c.coachKey} coach={coach} classKey={classId} date={moment().format("YYYYMMDD")}/> )
               }
             })
           }
         }
      })
    }
    else {
      html.push(<div key='1' style={{paddingTop: '40px', textAlign: 'center'}}>No Sessions Today</div>)
    }


   return (
     <div>

       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={12} md={12}>
           <Search type="coach" />
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(CoachAttendance);
