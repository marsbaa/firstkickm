import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
var {connect} = require('react-redux')
var actions = require('actions')
import {Row, Col, FormControl, FormGroup, ControlLabel, Radio} from 'react-bootstrap'

export var TrialAdd = React.createClass({

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
    var {selection} = this.props;
    this.setState({selectedCentre: selection.id});
  },


  onFormSubmit: function (e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var trial = {
      childName: document.getElementById("childName").value,
      contact: document.getElementById("contactNumber").value,
      email: document.getElementById("email").value,
      gender: document.getElementById("boy").checked ? "boy" : "girl",
      dateOfBirth: document.getElementById("dateOfBirth").value,
      dateOfTrial: document.getElementById("trialDateSelect").value,
      venueId: document.getElementById("centreSelect").value.toString(),
      timeOfTrial: document.getElementById("timeSlotSelect").value,
      parentName: document.getElementById("parentName").value,
      medicalCondition: document.getElementById("medicalCondition").value
    };
    dispatch(actions.addTrial(trial));
    browserHistory.push(`/m/trials`);
  },

  render: function () {
    var key = this.props.params.studentId;
    var {trials, centres, ageGroup, calendars} = this.props;

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
    var classTimings = [];
    Object.keys(centre.classes).forEach((classID) => {
      var cla = centre.classes[classID];
      var timing = cla.startTime + " - " + cla.endTime;
      classTimings.push(timing);
    });
    classTimings = _.uniq(classTimings);

    classTimings.map((timing)=> {
        classTimeSlots.push(<option key={timing} value={timing}>{timing}</option>);
      });

    //Trial dates
    var trialDateOptions = [];
    trialDateOptions.push(<option key="0" value="0">select</option>);
    calendars.map((calendar) => {
      if (centre.key === calendar.centreKey) {
        calendar.terms.map((term) => {
          term.map((dates) => {
            if (dates >= moment().format('YYYY-MM-DD')){
              var formattedDate = moment(dates).format("YYYY-MM-DD");
              trialDateOptions.push(<option key={formattedDate} value={formattedDate}>{formattedDate}</option>);
            }
          })
        })
      }
    })


    return (
        <Row style={{padding: '10px'}}>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Child's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="childName"
              type="text"
              placeholder="Enter Child's Name"/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Date of Birth (YYYY-MM-DD)</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="dateOfBirth"
              type="text"
              placeholder="Enter Date of Birth"/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Medical Condition</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="medicalCondition"
              type="text"
              placeholder="Enter Medical Condition"/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Centre</ControlLabel>
              <FormControl
                id="centreSelect" componentClass="select" placeholder="select"
                onChange={this.centreSelect}>
                {centreOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Class Time</ControlLabel>
              <FormControl
                id="timeSlotSelect" componentClass="select" placeholder="select">
                {classTimeSlots}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Date of Trial</ControlLabel>
              <FormControl
                id="trialDateSelect" componentClass="select" placeholder="select"
                onChange={this.trialDateSelect}>
                {trialDateOptions}
              </FormControl>
            </FormGroup>

            <FormGroup>
              <ControlLabel>Mobile Number</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="contactNumber"
              type="text"
              placeholder="Enter Mobile Number"/>
            </FormGroup>

          </Col>
          <Col md={6}>



            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="email"
              type="text"
              placeholder="Enter Email"/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Parent's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="parentName"
              type="text"
              placeholder="Enter Parent's Name"/>
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
)(TrialAdd);
