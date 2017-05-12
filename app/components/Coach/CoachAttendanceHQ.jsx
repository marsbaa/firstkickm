import React from 'react';
import {Link} from 'react-router'
import {Grid, Row, Col, FormGroup, ControlLabel} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
var actions = require('actions');
import CoachAttendee from 'CoachAttendee'
import CoachesFilter from 'CoachesFilter'
import Search from 'Search'
import _ from 'lodash'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

class CoachAttendanceHQ extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      startDate : "",
      termDates : []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    var {dispatch, coaches, coachSchedule, selection, calendars} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
    }
    if (_.isEmpty(coachSchedule)) {
      dispatch(actions.startCoachSchedule());
    }
    var termDates = [];
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if(calendar.centreKey === selection.key) {
        Object.keys(calendar.terms).map((termId) => {
          var term = calendar.terms[termId]
          term.map((date) => {
            date = moment(date).format("YYYYMMDD")
            if(moment(date).isSameOrBefore()) {
              termDates.push(moment(date));
            }
          })
        })
      }
    })
    this.setState({startDate: termDates[termDates.length-1]})
    this.setState({termDates})
  }
  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/coachattendanceHQ", selection.name+" Coach Attendance"));
    window.scrollTo(0, 0)
  }



  render() {
    var {coaches, searchText, selection, calendars, coachSchedule} = this.props;
    var filteredCoaches = CoachesFilter.filter(coaches, searchText)
    var html=[];
    var classes = selection.classes
    Object.keys(classes).map((classId)=> {
      var {ageGroup, day, endTime, startTime} = classes[classId]
      html.push(<Row key={classId} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
         <Col xs={12} md={12}>
           <h5>{ageGroup} {startTime} - {endTime} ({day})</h5>
         </Col>
       </Row>)
       var schedule = _.find(coachSchedule, {'classKey' : classId, 'date': moment(this.state.startDate).format('YYYYMMDD')})
       if (schedule != undefined) {
         if(_.size(schedule.assigned) != 0) {
           schedule.assigned.map((c) => {
             var coach = _.find(filteredCoaches, {'key': c.coachKey })
             if (coach != undefined) {
               html.push(<CoachAttendee key={c.coachKey+this.state.startDate+startTime} coach={coach} classKey={classId} date={this.state.startDate} /> )
             }
           })
         }
         else {
           html.push(<h5 key={classId+"noneassigned"} style={{padding: '3px 15px'}}>None Assigned</h5>)
         }
       }

    })


   return (
     <Grid style={{padding: '10px 0px'}}>
       <Row style={{padding: '8px 10px'}}>
         <Col xs={12} md={12}>
           <FormGroup style={{marginBottom: '0'}}>
             <ControlLabel>Date of Session</ControlLabel>
               <DatePicker
                 id = "datePicker"
                 dateFormat="YYYY-MM-DD"
                 selected={this.state.startDate}
                 includeDates={this.state.termDates}
                 onChange={(e) => {
                       this.handleChange(moment(e))}}
                 />
           </FormGroup>
         </Col>
       </Row>
      {html}
    </Grid>
   );
 }
 }

 export default connect((state) => {return state;
})(CoachAttendanceHQ);
