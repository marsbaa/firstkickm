import React from 'react';
import {Link} from 'react-router'
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, ButtonGroup, Button} from 'react-bootstrap'
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
      termDates : [],
      filter: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    var {selection, calendars} = this.props;
    var termDates = [];
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if(calendar.centreKey === selection.key) {
        Object.keys(calendar.terms).map( (termId) => {
          var term = calendar.terms[termId]
          term.map((date) => {
            date = moment(date).format("YYYYMMDD")
            termDates.push(moment(date));
          })
        })
      }
    })
    this.setState({termDates})
  }

  handleSelect(e) {
    e.preventDefault()
    var id = e.target.id
    var className = e.target.className
    if (id === 'all' && className === 'normalbtn btn btn-default'){
      e.target.className = 'selectedbtn btn btn-default'
      document.getElementById('am').className = 'normalbtn btn btn-default'
      document.getElementById('pm').className = 'normalbtn btn btn-default'
      this.setState({filter: ''})
    }
    else if (id === 'am' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default'
      document.getElementById('all').className = 'normalbtn btn btn-default'
      document.getElementById('pm').className = 'normalbtn btn btn-default'
      this.setState({filter: 'am'})
    }
    else if (id === 'pm' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default'
      document.getElementById('all').className = 'normalbtn btn btn-default'
      document.getElementById('am').className = 'normalbtn btn btn-default'
      this.setState({filter: 'pm'})
    }
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
    filteredStudents = _.filter(filteredStudents, (o) => {
      return !(o.status==='Not Active')})
    var filteredMakeUps = _.filter(makeUps, {toCentre: selection.key, toDate: moment(this.state.startDate).format('YYYY-MM-DD')})
    if (filteredStudents.length !== 0) {
      var groupDay = _.groupBy(filteredStudents, (o) => {
        return o.currentClassDay.toLowerCase()
      });
      Object.keys(groupDay).forEach((day) => {
        if (_.capitalize(day) === moment(this.state.startDate).format("dddd")){
          var groupTime = groupDay[day]
          if (this.state.filter !== '') {
            groupTime = _.filter(groupDay[day], (o) => {
            var timeSplit = o.currentClassTime.split(' - ')
            var startTime = timeSplit[0].split(':')
            if (startTime[1].endsWith(this.state.filter)){
              return true
            }
            else {
              false
            }
            })
         }
          groupTime = _.orderBy(groupTime, (o) => {
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
            var groupAge = _.orderBy(groupTime[timeSlot], ['asc'])
            groupAge = _.groupBy(groupAge, 'ageGroup');
            Object.keys(groupAge).forEach((age)=> {
              var group = groupAge[age];
              group = _.sortBy(group, ['childName'])
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
      })
    }
    else {
      html.push(<div key='1' style={{paddingTop: '40px', textAlign: 'center'}}>No Sessions Today</div>)
    }


   return (
     <Grid style={{padding: '10px 0px'}}>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={7} md={7}>
           <Search type="student" />
         </Col>
         <Col xs={5} md={5}>
           <ButtonGroup>
              <Button id='all' style={{margin: '0px'}} className="selectedbtn" onClick={this.handleSelect.bind(this)}>All</Button>
              <Button id='am' style={{margin: '0px'}}  className="normalbtn" onClick={this.handleSelect.bind(this)}>AM</Button>
              <Button id='pm' style={{margin: '0px'}} className="normalbtn" onClick={this.handleSelect.bind(this)}>PM</Button>
           </ButtonGroup>
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
