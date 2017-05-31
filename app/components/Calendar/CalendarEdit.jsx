import React from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'
import TermDatesSelector from 'TermDatesSelector'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import {Link} from 'react-router'
var actions = require('actions');

class CalendarEdit extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      errorCalendarName: null,
      errorMessageCalendarName: ""
    }
    this.saveCalendar = this.saveCalendar.bind(this)
  }

  goBack(e) {
    e.preventDefault();
    browserHistory.push('/m/centres/'+ this.props.params.centreKey);
  }

  saveCalendar(e, centreKey) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    var {dispatch, terms, calendars} = this.props;
    var calendarKey = this.props.params.calendarKey;
    var calendarName = document.getElementById("calendarName").value;
    if (calendarName === "") {
      this.setState({
        errorCalendarName: 'error',
        errorMessageCalendarName: 'Field Empty. Please enter Calendar Name'
      });
    }
    else {
      this.setState({
        errorCalendarName: null,
        errorMessageCalendarName: ''
      });
      if (calendarKey === 'add') {
        var calendar = {
          name: calendarName,
          centreKey,
          terms
        }
        dispatch(actions.addTerm(calendar));
      }
      else {
        var calendar = {
          name: calendarName,
          centreKey,
          terms,
        }
        dispatch(actions.updateTerm(calendar, calendarKey));
      }
      browserHistory.push('/m/centres/'+ centreID);
    }
  }

  componentWillUnmount(){
    var {dispatch} = this.props;
    dispatch(actions.resetTerms());
  }

  componentWillMount() {
    var {dispatch} = this.props;
    var centreID = this.props.params.centreID;
    var {calendars} = this.props;
    var calendarKey = this.props.params.calendarKey;
    if (calendarKey !== 'add') {
        var terms = calendars[calendarKey].terms;
        dispatch(actions.startTerms(terms));
      }
  }



  render() {
    var centreID = this.props.params.centreID;
    var calendarKey = this.props.params.calendarKey;
    var {centres, calendars} = this.props;
    var calendar = {};
    var count = 0;
    var numOfTerms = 6;

    if (calendarKey !== 'add') {
      calendar = calendars[calendarKey];
      if (calendar !== undefined) {
        numOfTerms = Object.keys(calendar.terms)[Object.keys(calendar.terms).length-1];
      }
    }

     return (
       <Grid style={{marginTop: '20px'}}>
         <Row>
           <Col md={6}>
             <FormGroup validationState={this.state.errorCalendarName}>
               <ControlLabel>Calendar Name</ControlLabel>
               <FormControl style={{marginBottom: '10px'}}
               id="calendarName"
               type="text"
               defaultValue={calendar.name}
               placeholder="Enter Name of Calendar"/>
             <HelpBlock>{this.state.errorMessageCalendarName}</HelpBlock>
             </FormGroup>
             <TermDatesSelector mode={calendarKey} numOfTerms={numOfTerms}/>
             <Button onClick={this.goBack.bind(this)}>Cancel</Button>
             <Button onClick={(e) => this.saveCalendar(e, getCentreKey(centres, centreID))}>Save</Button>
          </Col>
        </Row>
      </Grid>
     );
   }
}

export default connect((state) => {return state;
})(CalendarEdit);
