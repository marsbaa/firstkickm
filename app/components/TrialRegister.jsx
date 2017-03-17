import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
var {connect} = require('react-redux')
var actions = require('actions')
import {Row, Col, FormControl, FormGroup, ControlLabel, Radio} from 'react-bootstrap'

export var TrialRegister = React.createClass({

  getInitialState(){
    return {
      selectedCentre : "",
      trialDate : ''
    }
  },

  centreSelect(e) {
    e.preventDefault();
    this.setState({
      selectedCentre: e.target.value
    });
  },

  trialDateSelect(e) {
    e.preventDefault();
    this.setState({
      trialDate : e.target.value
    });
  },

  componentWillMount() {
    var key = this.props.params.studentId;
    var {trials,centres} = this.props;
    var trial = _.find(trials, {id: key});
    this.setState({selectedCentre: trial.venueId});
    this.setState({trialDate: trial.dateOfTrial});
  },

  componentDidMount() {
    var key = this.props.params.studentId;
    var {trials} = this.props;
    var trial = _.find(trials, {id: key});
    document.getElementById("boy").checked = trial.gender==="boy" ? true: false;
    document.getElementById("girl").checked = trial.gender==="girl" ? true: false;
  },

  onFormSubmit: function (e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var key = this.props.params.studentId;
    var trial = {
      id: key,
      childName: document.getElementById("childName").value,
      contactNumber: document.getElementById("contactNumber").value,
      email: document.getElementById("email").value,
      gender: document.getElementById("boy").checked ? "boy" : "girl",
      dateOfBirth: document.getElementById("dateOfBirth").value,
      dateOfTrial: document.getElementById("trialDateSelect").value,
      venueId: document.getElementById("centreSelect").value.toString(),
      timeOfTrial: document.getElementById("timeSlotSelect").value,
      parentName: document.getElementById("parentName").value,
      medicalCondition: document.getElementById("medicalCondition").value
    };
    dispatch(actions.updateTrial(trial));
    browserHistory.push(`/m/trials`);
  },

  render: function () {
    var key = this.props.params.studentId;
    var {trials,centres, ageGroup, calendars} = this.props;
    var trial = _.find(trials, {id: key});
    var getAge = (dob) => {
    var now = moment();
    var dateofbirth = moment(JSON.stringify(dob), "YYYY-MM-DD");
    return now.diff(dateofbirth, 'years');
  };
    var childAgeGroup;
    ageGroup.map((group) => {
      var age = getAge(trial.dateOfBirth);
      if (age >= group.minAge && age <= group.maxAge) {
        childAgeGroup = group.name;
      }
    });

    //Centre List
    var centreOptions = [];
    centreOptions.push(<option key="0" value="0">select</option>);
    centres.map((centre) => {
      centreOptions.push(<option key={centre.id} value={centre.id}>{_.upperFirst(centre.name)}</option>);
    });

    //Class TimeSlots
    var classTimeSlots = [];
    classTimeSlots.push(<option key="0" value="0">select</option>);
    var centre = {};
    centres.map((c) => {
      if(c.id === this.state.selectedCentre.toString()) {
        centre = c;
      }
    });

    Object.keys(centre.classes).forEach((classID) => {
      var cla = centre.classes[classID];
      if (cla.ageGroup === childAgeGroup) {
        var classTime = cla.startTime + " - " + cla.endTime;
        var classTimeDay = classTime+ " ("+cla.day+")";
        classTimeSlots.push(<option key={classTimeDay} value={classTime}>{classTimeDay}</option>);
      }

    });

    //Trial dates
    var trialDateOptions = [];
    trialDateOptions.push(<option key="0" value="0">select</option>);
    calendars.map((calendar) => {
      if (centre.key === calendar.centreKey) {
        calendar.terms.map((term) => {
          term.map((dates) => {
            var formattedDate = moment(dates).format("YYYY-MM-DD");
            trialDateOptions.push(<option key={formattedDate} value={formattedDate}>{formattedDate}</option>);
          })
        })
      }
    })


    return (
        <Row style={{padding: '10px'}}>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Selected Centre</ControlLabel>
              <FormControl
                id="centreSelect" componentClass="select" placeholder="select"
                defaultValue={trial.venueId}
                onChange={this.centreSelect}>
                {centreOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Class Time</ControlLabel>
              <FormControl
                id="timeSlotSelect" componentClass="select" placeholder="select"
                defaultValue={trial.timeOfTrial}>
                {classTimeSlots}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Date of Trial</ControlLabel>
              <FormControl
                id="trialDateSelect" componentClass="select" placeholder="select"
                defaultValue={trial.dateOfTrial}
                onChange={this.trialDateSelect}>
                {trialDateOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Child's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="childName"
              type="text"
              placeholder="Enter Child's Name"
              defaultValue={trial.childName}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Mobile Number</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="contactNumber"
              type="text"
              placeholder="Enter Mobile Number"
              defaultValue={trial.contactNumber}/>
            </FormGroup>

          </Col>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Date of Birth</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="dateOfBirth"
              type="text"
              placeholder="Enter Date of Birth"
              defaultValue={trial.dateOfBirth}/>
            </FormGroup>

            <FormGroup>
              <ControlLabel>Medical Condition</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="medicalCondition"
              type="text"
              placeholder="Enter Medical Condition"
              defaultValue={trial.medicalCondition}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={trial.email}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Parent's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="parentName"
              type="text"
              placeholder="Enter Parent's Name"
              defaultValue={trial.parentName}/>
            </FormGroup>
            <FormGroup>
              <Radio id="boy" value="boy" name="gender" inline>
                Boy
              </Radio>
              {' '}
              <Radio id="girl" value="girl" name="gender" inline>
                Girl
              </Radio>
            </FormGroup>
            <button className="btn" style={{width: '100%', margin: '0'}} onClick={this.onFormSubmit}>Save Child Profile</button>
          </Col>
        </Row>
    );
  }
});

export default connect(
  (state) => {
    return state;
  }
)(TrialRegister);