import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
var {connect} = require('react-redux')
var actions = require('actions')
import {Row, Col, FormControl, FormGroup, ControlLabel, Radio} from 'react-bootstrap'

class StudentEdit extends React.Component {

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
    var key = this.props.params.studentId;
    var {students} = this.props;
    var student = _.find(students, {key: key});
    this.setState({selectedCentre: student.venueId});
  }

  componentDidMount() {
    var key = this.props.params.studentId;
    var {students} = this.props;
    var student = _.find(students, {key: key});
    document.getElementById("boy").checked = student.gender==="boy" ? true: false;
    document.getElementById("girl").checked = student.gender==="girl" ? true: false;
  }

  onFormSubmit(e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var key = this.props.params.studentId;
    var selected = document.getElementById("timeSlotSelect");
    var classTimeDay = selected.options[selected.selectedIndex].text;
    var a = _.split(classTimeDay, '(');
    var b = _.split(a[1], ')');
    var classDay = b[0];
    var student = {
      key,
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
      ageGroup: document.getElementById("ageGroup").value
    };
    dispatch(actions.updateStudent(key, student));
    browserHistory.push(`/m/students`);
  }

  render() {
    var key = this.props.params.studentId;
    var {students, centres, ageGroup, calendars} = this.props;
    var student = _.find(students, {key: key});

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
    var centre = {};
    centres.map((c) => {
      if(c.id === this.state.selectedCentre.toString()) {
        centre = c;
      }
    });

    Object.keys(centre.classes).forEach((classID) => {
      var cla = centre.classes[classID];
      if (cla.ageGroup === student.ageGroup) {
        var classTime = cla.startTime + " - " + cla.endTime;
        var classTimeDay = classTime+ " ("+cla.day+")";
        classTimeSlots.push(<option key={classTimeDay} value={classTime}>{classTimeDay}</option>);
      }
    });


    return (
        <Row style={{padding: '10px'}}>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Selected Centre</ControlLabel>
              <FormControl
                id="centreSelect" componentClass="select" placeholder="select"
                defaultValue={student.venueId}
                onChange={this.centreSelect.bind(this)}>
                {centreOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Assigned Age Group</ControlLabel>
              <FormControl
                id="ageGroup" componentClass="select" placeholder="select"
                defaultValue={student.ageGroup}
                onChange= {this.ageGroupSelect.bind(this)}>
                {ageGroups}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Class Time</ControlLabel>
              <FormControl
                id="timeSlotSelect" componentClass="select" placeholder="select"
                defaultValue={student.currentClassTime}>
                {classTimeSlots}
              </FormControl>
            </FormGroup>

            <FormGroup>
              <ControlLabel>Child's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="childName"
              type="text"
              placeholder="Enter Child's Name"
              defaultValue={student.childName}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Mobile Number</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="contactNumber"
              type="text"
              placeholder="Enter Mobile Number"
              defaultValue={student.contact}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={student.email}/>
            </FormGroup>


          </Col>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Date of Birth</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="dateOfBirth"
              type="text"
              placeholder="Enter Date of Birth"
              defaultValue={student.dateOfBirth}/>
            </FormGroup>

            <FormGroup>
              <ControlLabel>Medical Condition</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="medicalCondition"
              type="text"
              placeholder="Enter Medical Condition"
              defaultValue={student.medicalCondition}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Address</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="address"
              type="text"
              placeholder="Enter Address"
              defaultValue={student.address}/>
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
              defaultValue={student.parentName}/>
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
            <button className="btn" style={{width: '100%', margin: '0'}} onClick={this.onFormSubmit.bind(this)}>Save Child Profile</button>
          </Col>
        </Row>
    )
  }
}

export default connect(
  (state) => {
    return state;
  }
)(StudentEdit);
