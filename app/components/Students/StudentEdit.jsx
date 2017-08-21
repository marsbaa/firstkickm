import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
var { connect } = require('react-redux');
var actions = require('actions');
import {
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Radio
} from 'react-bootstrap';
import { isManager } from 'helper';

class StudentEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCentre: '',
      ageGroup: ''
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
    var { selection } = this.props;
    this.setState({ selectedCentre: selection.key });
  }

  componentDidMount() {
    var key = this.props.params.studentId;
    var { students } = this.props;
    var student = _.find(students, { key: key });
    document.getElementById('boy').checked =
      student.gender === 'boy' ? true : false;
    document.getElementById('girl').checked =
      student.gender === 'girl' ? true : false;
    this.setState({ ageGroup: student.ageGroup });
  }

  deleteStudent(e) {
    e.preventDefault();
    var { dispatch } = this.props;
    var key = this.props.params.studentId;
    dispatch(actions.deleteStudent(key));
    browserHistory.goBack();
  }

  onFormSubmit(e) {
    e.preventDefault();
    var { dispatch, centres, students } = this.props;
    var key = this.props.params.studentId;
    var student = _.find(students, { key: key });
    var classTimeDay = document.getElementById('timeSlotSelect').value;
    var a = _.split(classTimeDay, ' (');
    var b = _.split(a[1], ')');
    var classDay = b[0];
    student = {
      ...student,
      childName: document.getElementById('childName').value,
      contact: document.getElementById('contactNumber').value,
      email: document.getElementById('email').value,
      gender: document.getElementById('boy').checked ? 'boy' : 'girl',
      dateOfBirth: document.getElementById('dateOfBirth').value,
      venueId: centres[document.getElementById('centreSelect').value].id,
      currentClassTime: a[0],
      currentClassDay: classDay,
      parentName: document.getElementById('parentName').value,
      medicalCondition: document.getElementById('medicalCondition').value,
      address: document.getElementById('address').value,
      postalcode: document.getElementById('postalcode').value,
      ageGroup: document.getElementById('ageGroup').value,
      status: document.getElementById('status').value
    };
    dispatch(actions.updateStudent(key, student));
    browserHistory.goBack();
  }

  render() {
    var key = this.props.params.studentId;
    var { students, centres, ageGroup, users, auth, selection } = this.props;
    var student = _.find(students, { key: key });

    //Age Group List
    var ageGroups = [];
    ageGroups.push(
      <option key="0" value="0">
        select
      </option>
    );
    ageGroup.map(group => {
      ageGroups.push(
        <option key={group.name} value={group.name}>
          {group.name +
            ' (' +
            group.minAge +
            ' - ' +
            group.maxAge +
            ' years old)'}
        </option>
      );
    });
    //Centre List
    var centreOptions = [];
    centreOptions.push(
      <option key="0" value="0">
        select
      </option>
    );
    Object.keys(centres).map(centreKey => {
      var centre = centres[centreKey];
      centreOptions.push(
        <option key={centreKey} value={centreKey}>
          {_.upperFirst(centre.name)}
        </option>
      );
    });

    //Class TimeSlots
    var classTimeSlots = [];
    classTimeSlots.push(
      <option key="0" value="0">
        select
      </option>
    );
    var centre = centres[this.state.selectedCentre];

    Object.keys(centre.classes).forEach(classID => {
      var cla = centre.classes[classID];
      if (cla.ageGroup === this.state.ageGroup) {
        var classTime = cla.startTime + ' - ' + cla.endTime;
        var classTimeDay = classTime + ' (' + cla.day + ')';
        classTimeSlots.push(
          <option key={classTimeDay} value={classTimeDay}>
            {classTimeDay}
          </option>
        );
      }
    });

    return (
      <Row style={{ padding: '10px' }}>
        <Col md={6}>
          <FormGroup>
            <ControlLabel>Selected Centre</ControlLabel>
            <FormControl
              id="centreSelect"
              componentClass="select"
              placeholder="select"
              defaultValue={selection.key}
              onChange={this.centreSelect.bind(this)}
            >
              {centreOptions}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Assigned Age Group</ControlLabel>
            <FormControl
              id="ageGroup"
              componentClass="select"
              placeholder="select"
              defaultValue={student.ageGroup}
              onChange={this.ageGroupSelect.bind(this)}
            >
              {ageGroups}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Selected Class Time</ControlLabel>
            <FormControl
              id="timeSlotSelect"
              componentClass="select"
              placeholder="select"
              defaultValue={
                student.currentClassTime + ' (' + student.currentClassDay + ')'
              }
            >
              {classTimeSlots}
            </FormControl>
          </FormGroup>

          <FormGroup>
            <ControlLabel>Child's Name</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="childName"
              type="text"
              placeholder="Enter Child's Name"
              defaultValue={student.childName}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Mobile Number</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="contactNumber"
              type="text"
              placeholder="Enter Mobile Number"
              defaultValue={student.contact}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={student.email}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <ControlLabel>Date of Birth</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="dateOfBirth"
              type="text"
              placeholder="Enter Date of Birth"
              defaultValue={student.dateOfBirth}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Medical Condition</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px', height: '90px' }}
              id="medicalCondition"
              componentClass="textarea"
              placeholder="Enter Medical Condition"
              defaultValue={student.medicalCondition}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Address</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="address"
              type="text"
              placeholder="Enter Address"
              defaultValue={student.address}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Postal Code</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="postalcode"
              type="text"
              placeholder="Enter Postal Code"
              defaultValue={student.postalcode}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Parent's Name</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="parentName"
              type="text"
              placeholder="Enter Parent's Name"
              defaultValue={student.parentName}
            />
          </FormGroup>
          <FormGroup>
            <Radio id="boy" value="boy" name="gender" inline>
              Boy
            </Radio>{' '}
            <Radio id="girl" value="girl" name="gender" inline>
              Girl
            </Radio>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Student Status</ControlLabel>
            <FormControl
              componentClass="select"
              placeholder="select"
              id="status"
              defaultValue={
                student.status === 'Not Active' ? 'Not Active' : 'Active'
              }
            >
              <option value="Active">Active</option>
              <option value="Not Active">Not Active</option>
            </FormControl>
          </FormGroup>
          <button className="submitbtn" onClick={this.onFormSubmit.bind(this)}>
            Save Student Profile
          </button>
          {isManager(auth, users)
            ? <button
                className="submitbtn"
                style={{ backgroundColor: 'red' }}
                onClick={this.deleteStudent.bind(this)}
              >
                Delete Student Profile
              </button>
            : null}
        </Col>
      </Row>
    );
  }
}

export default connect(state => {
  return state;
})(StudentEdit);
