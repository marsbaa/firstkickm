import React from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'
import TimePicker from 'react-timepicker';
import moment from 'moment'
var actions = require('actions');
var {connect} = require('react-redux');
import {browserHistory} from 'react-router'
import {Link} from 'react-router'
import 'react-timepicker/timepicker.css';

class ClassEdit extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      startTime: '',
      endTime: '',
      ageGroup: '',
      day: '',
      term: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleDayChange = this.handleDayChange.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.onChangeStartTime = this.onChangeStartTime.bind(this)
    this.onChangeEndTime = this.onChangeEndTime.bind(this)
    this.goBack = this.goBack.bind(this)
    this.saveClass = this.saveClass.bind(this)
    this.generateAgeGroups = this.generateAgeGroups.bind(this)
  }


 handleChange(e) {
   e.preventDefault();
   this.setState({
     ageGroup: e.target.value
   })
 }

 handleDayChange(e) {
   e.preventDefault();
   this.setState({
     day: e.target.value
   })
 }

 handleTermChange(e) {
   e.preventDefault();
   this.setState({
     term: e.target.value
   })
 }

  onChangeStartTime(hours,minutes) {
    var formattedHours, formattedMinutes, amPm;
    if (hours < 12) {
      formattedHours = hours
      amPm = "am";
    }
    else if (hours === 12) {
      amPm = "pm"
      formattedHours = hours;
    }
    else {
      formattedHours = hours-12;
      amPm = "pm"
    }

    if (minutes < 10) {
      formattedMinutes = "0"+minutes;
    }
    else {
      formattedMinutes = minutes;
    }
     var time = formattedHours+":"+formattedMinutes+amPm;
    this.setState({startTime: time});
  }

  onChangeEndTime(hours,minutes) {
    var formattedHours, formattedMinutes, amPm;
    if (hours < 12) {
      formattedHours = hours
      amPm = "am";
    }
    else if (hours === 12) {
      amPm = "pm"
      formattedHours = hours;
    }
    else {
      formattedHours = hours-12;
      amPm = "pm"
    }

    if (minutes < 10) {
      formattedMinutes = "0"+minutes;
    }
    else {
      formattedMinutes = minutes;
    }
     var time = formattedHours+":"+formattedMinutes+amPm;
    this.setState({endTime: time});
  }

  goBack(e) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    browserHistory.push('/m/centres/'+ centreID);
  }

  saveClass(e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var centreID = this.props.params.centreID;
    var centre;
    centres.map((c) => {
      if(c.id === centreID) {
        centre = c;
      }
    });
    var cla = {
      ageGroup : this.state.ageGroup,
      day : this.state.day,
      termKey : this.state.term,
      startTime: this.state.startTime,
      endTime: this.state.endTime
    };
    dispatch(actions.addClass(cla, centre.key));
    browserHistory.push('/m/centres/'+ centreID);
  }

  componentWillUnmount() {
    var {dispatch} = this.props;
    dispatch(actions.resetAgeGroup());
  }

  generateAgeGroups() {
    var {ageGroup} = this.props;
    var html = [];
    html.push(<option key="select" value="select">Select Age Group</option>)
    ageGroup.map((age) => {
      html.push(<option key={age.key} value={age.name}>{age.name}</option>)
    })
    return html;
  }

  render() {
     var {centres, calendars} = this.props;
     var centreID = this.props.params.centreID;
     var centre;
     centres.map((c) => {
       if(c.id === centreID) {
         centre = c;
       }
     });
     var termhtml = [];
     calendars.map((term) => {
       if (centre.key === term.centreKey) {
          termhtml.push(<option key={term.key} value={term.key}>{term.name}</option>);
       }
     });

     return (
       <Grid>
         <Row>
           <Col md={6}>
             <FormGroup>
               <ControlLabel>Age Group</ControlLabel>
                 <FormControl id="selectAgeGroup" componentClass="select" onChange={this.handleChange}>
                   {this.generateAgeGroups()}
                 </FormControl>
             </FormGroup>
             <FormGroup>
               <ControlLabel>Day of Week</ControlLabel>
                 <FormControl id="selectDay" componentClass="select" onChange={this.handleDayChange}>
                   <option value="select">Select Day of Week</option>
                   <option value="saturday">Saturday</option>
                   <option value="sunday">Sunday</option>
                   <option value="monday">Monday</option>
                   <option value="tuesday">Tuesday</option>
                   <option value="wednesday">Wednesday</option>
                   <option value="thursday">Thursday</option>
                   <option value="friday">Friday</option>
                 </FormControl>
             </FormGroup>
             <FormGroup>
               <ControlLabel>Term Calendar</ControlLabel>
                 <FormControl id="selectTerm" componentClass="select" onChange={this.handleTermChange}>
                   <option value="select">Select Term to Follow</option>
                   {termhtml}
                 </FormControl>
             </FormGroup>
             <FormGroup>
               <ControlLabel>Start Time</ControlLabel>
                <TimePicker onChange={this.onChangeStartTime} />
             </FormGroup>
             <FormGroup>
               <ControlLabel>End Time</ControlLabel>
                 <TimePicker onChange={this.onChangeEndTime}/>
             </FormGroup>

             <Button onClick={this.goBack}>Cancel</Button>
             <Button onClick={this.saveClass}>Save</Button>
          </Col>
        </Row>
      </Grid>
     );
   }
}

export default connect((state) => {return state;
})(ClassEdit);
