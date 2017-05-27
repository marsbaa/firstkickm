import React from 'react'
import Schedule from 'Schedule'
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

class ScheduleList extends React.Component{


  render() {
    var {selection, coachSchedule, students, calendarKey, date, term, trials, ageGroup} = this.props;
    var day = moment(date).format('dddd')
    var classes = selection.classes;
    var html = []
    var sortedClasses = []
    Object.keys(classes).map((classKey)=> {
      sortedClasses.push({
        key: classKey,
        ...classes[classKey]
      })
    })
    sortedClasses = _.sortBy(sortedClasses, (o) => {
        var endTime = o.endTime.split(':')
        if (endTime[1].endsWith('pm')){
          endTime[0] = endTime[0]+12
        }
        endTime = endTime[0]+":"+endTime[1]
        return endTime
      })
    Object.keys(sortedClasses).forEach((classId) => {
      var cla = sortedClasses[classId]
      if (cla.termKey === calendarKey) {
        var classTime = cla.startTime+" - "+cla.endTime
        var filteredStudents = _.filter(students, (o) => {
          if (o.venueId !== undefined) {
            return o.venueId.toString() === selection.id
          }
        })
        filteredStudents = _.filter(filteredStudents, {'currentClassTime' : classTime, 'ageGroup': cla.ageGroup})
        filteredStudents = _.filter(filteredStudents, (o) => {
          return _.capitalize(o.currentClassDay) === day
        })

        var paid = 0
        Object.keys(filteredStudents).map((studentId) => {
          var student = filteredStudents[studentId]
          if (student.payments !== undefined) {
            var found = _.find(student.payments, (o) => {
              if(o.termsPaid !== undefined) {
                if(_.find(o.termsPaid[term], (o) => { return moment(o.date).isSame(date, 'day')}) !== undefined) {
                  return true
                }
              }
            })
            if (found !== undefined) {
              paid += 1
            }
          }
        })
        var getAge = (dob) => {
        var now = moment();
        var dateofbirth = moment(JSON.stringify(dob), "YYYY-MM-DD");
        return now.diff(dateofbirth, 'years');
        };
        var filteredTrials = _.filter(trials, {'venueId': selection.id, 'timeOfTrial': classTime, 'dateOfTrial': moment(date).format('YYYY-MM-DD')})
        filteredTrials = _.filter(filteredTrials, (o)=> {
          var childAgeGroup;
          ageGroup.map((group) => {
            var age = getAge(o.dateOfBirth);
            if (age >= group.minAge && age <= group.maxAge) {
              childAgeGroup = group.name;
              if (childAgeGroup === 'U8B') {
                childAgeGroup = 'U8'
              }
            }
          });
          return childAgeGroup === cla.ageGroup
        })
        var numOfTrials = _.size(filteredTrials)
        html.push(<Schedule key={classId} classKey={cla.key} cla={cla} date={date} paid={paid} numOfTrials={numOfTrials}/>)
      }
    })

   return (
     <Grid style={{paddingTop: '20px', paddingBottom: '200px'}}>
       <Row style={{padding: '10 0'}}>
         <Col md={12} xs={12}>
           <p style={{textAlign: 'center', fontSize: '14px', fontWeight: '600'}}>{moment(date).format("D MMM YYYY")}</p>
        </Col>
       </Row>
       <Row style={{height: '200px'}}>
         <Col md={12} xs={12}>
           {html}
        </Col>
      </Row>
    </Grid>

   );
  }
}

 export default connect((state) => {return state;
})(ScheduleList);
