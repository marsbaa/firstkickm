import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {startCoachSchedule, updateNavTitle} from 'actions'
import {startCoaches} from 'CoachesActions'
import CoachAttendee from 'CoachAttendee'
import CoachesFilter from 'CoachesFilter'
import Search from 'Search'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import size from 'lodash/size'
import filter from 'lodash/filter'
import moment from 'moment'

class CoachAttendance extends React.Component{

  componentWillMount() {
    var {dispatch, coaches, coachSchedule} = this.props;
    if (isEmpty(coaches)) {
      dispatch(startCoaches());
    }
    if (isEmpty(coachSchedule)) {
      dispatch(startCoachSchedule());
    }
  }


  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(updateNavTitle("/m/coachattendance", selection.name+" Coach Attendance"));
  }



  render() {
    var {coaches, searchText, selection, calendars, coachSchedule} = this.props;
    var filteredCoaches = CoachesFilter.filter(coaches, searchText)
    var today=-1;
    var html=[];
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      Object.keys(calendar.terms).map(year=> {
        Object.keys(calendar.terms[year]).map((termId) => {
          var term = calendar.terms[year][termId]
          term.map ((date)=> {
            if( moment().isSame(date, 'day')) {
              today = 1;
            }
          })
        })
      })
    });
    if (today !== -1) {
      var classes = selection.classes
      Object.keys(classes).map((classId)=> {
        var {ageGroup, day, endTime, startTime} = classes[classId]
        var schedule = find(coachSchedule, {'classKey' : classId, 'date': moment().format('YYYYMMDD')})
        if (schedule != undefined) {
          if(size(schedule.assigned) != 0) {
            html.push(<Row key={classId} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
               <Col xs={12} md={12}>
                 <h5>{ageGroup} {startTime} - {endTime} ({day})</h5>
               </Col>
             </Row>)
             schedule.assigned.map((c) => {
               var coach = find(filteredCoaches, {'key': c.coachKey })
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

 function mapStateToProps(state) {
   return {
    coaches: state.coaches, 
    searchText: state.searchText, 
    selection: state.selection, 
    calendars: filter(state.calendars, {centreKey: state.selection.key}), 
    coachSchedule: state.coachSchedule
   }
 }

 export default connect(mapStateToProps)(CoachAttendance);
