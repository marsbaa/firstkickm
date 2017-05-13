import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import Attendee from 'Attendee'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import Search from 'Search'
import _ from 'lodash'
import moment from 'moment'

class AttendanceList extends React.Component{


  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/attendance", selection.name+" Attendance"));
  }



  render() {
    var {students, searchText, selection, calendars, makeUps} = this.props;
    var today=-1;
    var html=[];
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendars[calendarKey].centreKey === selection.key) {
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
      var filteredStudents = StudentsFilter.filter(students, selection.id, searchText);
      filteredStudents = _.filter(filteredStudents, (o) => {
        return !(o.status==='Not Active')})
      var filteredMakeUps = _.filter(makeUps, {toCentre: selection.key, toDate: moment().format('YYYY-MM-DD')})
      if (filteredStudents.length !== 0) {
        var groupDay = _.groupBy(filteredStudents, 'currentClassDay');
        Object.keys(groupDay).forEach((day) => {
          if (_.capitalize(day) === moment().format("dddd")){
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
                group = _.sortBy(group, ['childName'])
                var attended = 0;
                var date = moment().format("YYYY-MM-DD");
                Object.keys(group).forEach((studentId) => {
                  if (group[studentId].attendance !== undefined) {
                    if (group[studentId].attendance[date] !== undefined) {
                      if (group[studentId].attendance[date].attended) {
                        attended = attended + 1;
                      }
                    }
                  }
                });
                html.push( <Row key={age+timeSlot} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
                   <Col xs={9} md={9}>
                     <h5>{age} {timeSlot}</h5>
                   </Col>
                     <Col xs={3} md={3} style={{textAlign: 'center'}}>
                       <h5><font style={{color: 'white'}}>{attended}</font> / {_.size(group)}
                       </h5>
                   </Col>
                 </Row>);

                 Object.keys(group).forEach((studentId) => {
                     html.push(<Attendee key={group[studentId].key} student={group[studentId]} date={date}/>);

                 });
              })
            })
          }
        })
      }
    }
    else {
      html.push(<div key='1' style={{paddingTop: '40px', textAlign: 'center'}}>No Sessions Today</div>)
    }


   return (
     <div>

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
})(AttendanceList);
