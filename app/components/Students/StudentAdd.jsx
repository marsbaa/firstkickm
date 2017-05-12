import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
var {connect} = require('react-redux')
var actions = require('actions')
import {Row, Col, FormControl, FormGroup, ControlLabel, Radio} from 'react-bootstrap'

class StudentAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCentre : "",
      ageGroup: ""
    };
  }

  centreSelect(e) {
    e.preventDefault();
    this.setState({
      selectedCentre: e.target.value
    });
  }

  ageGroupSelect(e) {
    e.preventDefault();
    this.setState({
      ageGroup: e.target.value
    });
  }

  componentWillMount() {
    var {selection} = this.props;
    this.setState({selectedCentre: selection.id});
  }

  onFormSubmit(e) {
    e.preventDefault();
    var {dispatch} = this.props;
    var selected = document.getElementById("timeSlotSelect");
    var classTimeDay = selected.options[selected.selectedIndex].text;
    var a = _.split(classTimeDay, '(');
    var b = _.split(a[1], ')');
    var classDay = b[0];
    var student = {
      childName: document.getElementById("childName").value,
      contact: document.getElementById("contactNumber").value,
      email: document.getElementById("email").value,
      gender: document.getElementById("boy").checked ? "boy" : "girl",
      dateOfBirth: document.getElementById("dateOfBirth").value,
      venueId: document.getElementById("centreSelect").value,
      currentClassTime: document.getElementById("timeSlotSelect").value,
      currentClassDay: classDay,
      parentName: document.getElementById("parentName").value,
      medicalCondition: document.getElementById("medicalCondition").value,
      address: document.getElementById("address").value,
      postalcode: document.getElementById('postalcode').value,
      ageGroup: document.getElementById("ageGroup").value
    };
    dispatch(actions.addStudent(student));
    browserHistory.push(`/m/students`);
  }

  render() {
    var {centres, ageGroup, calendars, selection} = this.props;

    //Age Group List
    var ageGroups = []
    ageGroups.push(<option key="0" value="0">select</option>);
    ageGroup.map((group) => {
      ageGroups.push(<option key={group.name} value={group.name}>{group.name +" ("+group.minAge+" - "+ group.maxAge+" years old)"}</option>);
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

    Object.keys(selection.classes).forEach((classID) => {
      var cla = selection.classes[classID];
      if (cla.ageGroup === this.state.ageGroup) {
        var classTime = cla.startTime + " - " + cla.endTime;
        var classTimeDay = classTime+ " ("+cla.day+")";
        classTimeSlots.push(<option key={classTimeDay} value={classTime}>{classTimeDay}</option>);
      }
    });



    return (
        <Row style={{padding: '10px'}}>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Child's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="childName"
              type="text"
              placeholder="Enter Child's Name"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Date of Birth</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="dateOfBirth"
              type="text"
              placeholder="Enter Date of Birth"
              />
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
            <FormGroup>
              <ControlLabel>Selected Centre</ControlLabel>
              <FormControl
                id="centreSelect" componentClass="select" placeholder="select"
                defaultValue={selection.id}
                onChange={this.centreSelect.bind(this)}>
                {centreOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Assigned Age Group</ControlLabel>
              <FormControl
                id="ageGroup" componentClass="select" placeholder="select"
                onChange= {this.ageGroupSelect.bind(this)}
                >
                {ageGroups}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Class Time</ControlLabel>
              <FormControl
                id="timeSlotSelect" componentClass="select" placeholder="select"
                >
                {classTimeSlots}
              </FormControl>
            </FormGroup>
          </Col>
          <Col md={6}>

            <FormGroup>
              <ControlLabel>Medical Condition</ControlLabel>
              <FormControl style={{marginBottom: '10px', height: '90px'}}
              id="medicalCondition"
              componentClass="textarea"
              placeholder="Enter Medical Condition"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Address</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="address"
              type="text"
              placeholder="Enter Address"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Postal Code</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="postalcode"
              type="text"
              placeholder="Enter Postal Code"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Parent's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="parentName"
              type="text"
              placeholder="Enter Parent's Name"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Mobile Number</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="contactNumber"
              type="text"
              placeholder="Enter Mobile Number"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="email"
              type="text"
              placeholder="Enter Email"
              />
            </FormGroup>

            <button className="submitbtn" onClick={this.onFormSubmit.bind(this)}>Save Child Profile</button>
          </Col>
        </Row>
    )
  }
}

export default connect(
  (state) => {
    return state;
  }
)(StudentAdd);
