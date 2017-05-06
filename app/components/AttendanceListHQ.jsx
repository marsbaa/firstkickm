import React from 'react';
import {Link} from 'react-router'
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import {connect} from 'react-redux';
import Attendee from 'Attendee'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import Search from 'Search'
import _ from 'lodash'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

class AttendanceListHQ extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      startDate : moment(),
      termDates : []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    var {selection, calendars} = this.props;
    var termDates = [];
    calendars.map((calendar) => {
      if(calendar.centreKey === selection.key) {
        calendar.terms.map((term, termId) => {
          term.map((date) => {
            date = moment(date).format("YYYYMMDD")
            if (moment(date).isSameOrBefore()) {
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
    var {dispatch, selection, makeUps} = this.props;
    if(_.isEmpty(makeUps)){
      dispatch(actions.startMakeUps())
    }
    dispatch(actions.updateNavTitle("/m/attendance/HQ", selection.name+" Attendance"));
  }



  render() {
    var {students, searchText, selection, calendars, makeUps} = this.props;
    var html=[];
    var filteredStudents = StudentsFilter.filter(students, selection.id, searchText);
    var filteredMakeUps = _.filter(makeUps, {toCentre: selection.key, toDate: moment(this.state.startDate).format('YYYY-MM-DD')})
    console.log(filteredMakeUps)
    if (filteredStudents.length !== 0) {
      var groupTime = _.groupBy(filteredStudents, 'currentClassTime');
      Object.keys(groupTime).forEach((timeSlot)=> {
        var groupAge = _.groupBy(groupTime[timeSlot], 'ageGroup');
        Object.keys(groupAge).forEach((age)=> {
          var group = groupAge[age];
          var attended = 0;
          var date = this.state.startDate
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
               html.push(<Attendee key={group[studentId].key} student={group[studentId]} date={date} type='normal'/>);

           });
           Object.keys(filteredMakeUps).forEach((makeUpId)=> {
             var student = _.find(students, {key: filteredMakeUps[makeUpId].studentKey})
             html.push(<Attendee key={student.key} student={student} date={date} type='makeup'/>);
           })

        })
      });
    }
    else {
      html.push(<div key='1' style={{paddingTop: '40px', textAlign: 'center'}}>No Sessions Today</div>)
    }


   return (
     <Grid style={{padding: '10px 0px'}}>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={12} md={12}>
           <Search type="student" />
         </Col>
       </Row>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={12} md={12}>
           <FormGroup style={{marginBottom: '0'}}>
             <ControlLabel>Date of Session</ControlLabel>
               <DatePicker
                 id = "datePicker"
                 dateFormat="YYYY-MM-DD"
                 selected={this.state.startDate}
                 includeDates={this.state.termDates}
                 onChange={this.handleChange}
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
})(AttendanceListHQ);