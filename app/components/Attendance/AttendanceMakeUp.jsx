import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
var {connect} = require('react-redux')
var actions = require('actions')
import {Panel, Grid, Row, Col, FormControl, FormGroup, ControlLabel, Radio} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

class AttendanceMakeUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fromDate : moment(),
      toDate: moment(),
      fromTermDates : [],
      toTermDates : [],
      selectedCentreTo: ''
    }
    this.handleChangeFrom = this.handleChangeFrom.bind(this)
    this.handleChangeTo = this.handleChangeTo.bind(this)
    this.centreSelectTo = this.centreSelectTo.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/attendance/HQ", "Make Up Form"));
   }

   componentWillMount() {
     var {selection, calendars} = this.props;
     var termDates = [];
     Object.keys(calendars).map((calendarKey) => {
       var calendar = calendars[calendarKey]
       if(calendar.centreKey === selection.key) {
         Object.keys(calendar.terms).map((termId) => {
           var term = calendar.terms[termId]
           term.map((date) => {
             date = moment(date).format("YYYYMMDD")
             if(moment(date).isSameOrAfter()) {
               termDates.push(moment(date));
             }
           })
         })
       }
     })
     this.setState({fromTermDates: termDates})
     this.setState({toTermDates: termDates})
     this.setState({toDate: termDates[0]})
     this.setState({fromDate: termDates[0]})
     this.setState({selectedCentreTo: selection.key})
   }

   handleChangeFrom(date) {
     this.setState({
       fromDate: date
     });
   }

   handleChangeTo(date) {
     this.setState({
       toDate: date
     });
   }

  centreSelectTo(e) {
    e.preventDefault();
    var termDates = [];
    var {calendars} = this.props
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]

      if(calendar.centreKey === e.target.value) {
        Object.keys(calendar.terms).map((termId) => {
          var term = calendar.terms[termId]
          term.map((date) => {
            date = moment(date).format("YYYYMMDD")
            if(moment(date).isSameOrAfter()) {
              termDates.push(moment(date));
            }
          })
        })
      }
    })
    this.setState({toDate: termDates[0]})
    this.setState({
      selectedCentreTo: e.target.value
    });
    this.setState({toTermDates: termDates})
  }


  onFormSubmit(e) {
    e.preventDefault();
    var {dispatch, selection} = this.props
    var studentKey = this.props.params.studentId
    var makeUp = {
      fromDate: document.getElementById('fromDate').value,
      toDate: document.getElementById('toDate').value,
      fromCentre: selection.key,
      toCentre: document.getElementById('toCentre').value,
      fromClassTimeDay: document.getElementById('fromClassTimeDay').value,
      toClassTimeDay: document.getElementById('toClassTimeDay').value,
      studentKey
    }
    if (makeUp.toCentre !== '0') {
      if (makeUp.toClassTimeDay !== '0'){
        dispatch(actions.addMakeUp(makeUp))
        browserHistory.push('/m/makeup')
      }
    }
  }

  render() {
    var {centres, students, selection} = this.props;
    var studentId = this.props.params.studentId
    var student = _.find(students, {key: studentId})
    //Centre List
    var centreOptions = [];
    centreOptions.push(<option key="0" value="0">select</option>);
    centres.map((centre) => {
      centreOptions.push(<option key={centre.key} value={centre.key}>{_.upperFirst(centre.name)}</option>);
    });

    //Class TimeSlots From
    var classTimeSlotsTo = [];
    classTimeSlotsTo.push(<option key="0" value="0">select</option>);
    var centreTo = {};
    centres.map((c) => {
      if(c.key === this.state.selectedCentreTo) {
        centreTo = c;
      }
    });

    Object.keys(centreTo.classes).forEach((classID) => {
      var cla = centreTo.classes[classID];
      if (cla.ageGroup === student.ageGroup) {
        var classTime = cla.startTime + " - " + cla.endTime;
        var classTimeDay = classTime+ " ("+_.capitalize(cla.day)+")";
        classTimeSlotsTo.push(<option key={classTimeDay} value={classTimeDay}>{classTimeDay}</option>);
      }

    });


    return (
      <Grid style={{marginTop: '20px'}}>
        <Panel header="From">
          <Row style={{padding: '10px'}}>
            <Col md={6}>
              <FormGroup>
                <ControlLabel>Selected Centre</ControlLabel>
                <FormControl
                  id="fromCentre" type="text" disabled
                  defaultValue={selection.name}>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Selected Class Time</ControlLabel>
                <FormControl
                  id="fromClassTimeDay" type="text" disabled
                  defaultValue={student.currentClassTime+ " ("+_.capitalize(student.currentClassDay)+")"}
                  >
                </FormControl>
              </FormGroup>
              <FormGroup style={{marginTop: '30px'}}>
                <ControlLabel>Selected Date</ControlLabel>
                  <DatePicker
                    id = "fromDate"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.fromDate}
                    includeDates={this.state.fromTermDates}
                    onChange={this.handleChangeFrom}
                    />
              </FormGroup>
            </Col>
          </Row>
        </Panel>
        <Panel header="To">
          <Row style={{padding: '10px'}}>
            <Col md={6}>
              <FormGroup>
                <ControlLabel>Selected Centre</ControlLabel>
                <FormControl
                  id="toCentre" componentClass="select" placeholder="select"
                  onChange={this.centreSelectTo}>
                  {centreOptions}
                </FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Selected Class Time</ControlLabel>
                <FormControl
                  id="toClassTimeDay" componentClass="select" placeholder="select"
                  >
                {classTimeSlotsTo}
                </FormControl>
              </FormGroup>
              <FormGroup style={{marginTop: '30px'}}>
                <ControlLabel>Selected Date</ControlLabel>
                  <DatePicker
                    id = "toDate"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.toDate}
                    includeDates={this.state.toTermDates}
                    onChange={this.handleChangeTo}
                    />
              </FormGroup>
            </Col>
          </Row>
        </Panel>
        <button className="submitbtn" onClick={this.onFormSubmit}>Submit Make Up</button>
      </Grid>

    )
  }
}

export default connect(
  (state) => {
    return state;
  }
)(AttendanceMakeUp);
