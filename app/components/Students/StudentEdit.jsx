import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { deleteStudent, updateStudent } from 'actions';
import filter from 'lodash/filter';
import find from 'lodash/find';
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
    let key = this.props.params.studentId;
    let { selection } = this.props;
    this.setState({ selectedCentre: selection.key });
  }

  componentDidMount() {
    const key = this.props.params.studentId;
    const { student } = this.props;
    document.getElementById('boy').checked =
      student.gender === 'boy' ? true : false;
    document.getElementById('girl').checked =
      student.gender === 'girl' ? true : false;
    this.setState({ ageGroup: student.ageGroup });
  }

  deleteStudent(e) {
    e.preventDefault();
    let { dispatch } = this.props;
    dispatch(deleteStudent(this.props.params.studentId));
    browserHistory.goBack();
  }

  onFormSubmit(e) {
    e.preventDefault();
    let { dispatch, centres, student } = this.props;
    let classTimeDay = document.getElementById('timeSlotSelect').value;
    let a = _.split(classTimeDay, ' (');
    let b = _.split(a[1], ')');
    let classDay = b[0];
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
    dispatch(updateStudent(student.key, student));
    browserHistory.goBack();
  }

  render() {
    const {
      student,
      centres,
      ageGroup,
      selection,
      classes,
      manager
    } = this.props;

    console.log(student);
    //Age Group List
    let ageGroups = [];
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
    let centreOptions = [];
    centreOptions.push(
      <option key="0" value="0">
        select
      </option>
    );
    Object.keys(centres).map(centreKey => {
      let centre = centres[centreKey];
      centreOptions.push(
        <option key={centreKey} value={centreKey}>
          {_.upperFirst(centre.name)}
        </option>
      );
    });

    //Class TimeSlots
    let classTimeSlots = [];
    let filteredClasses = filter(classes, {
      centreKey: this.state.selectedCentre
    });
    classTimeSlots.push(
      <option key="0" value="0">
        select
      </option>
    );

    Object.keys(filteredClasses).forEach(classID => {
      let cla = filteredClasses[classID];
      if (cla.ageGroup === this.state.ageGroup) {
        let classTime = cla.startTime + ' - ' + cla.endTime;
        let classTimeDay = classTime + ' (' + cla.day + ')';
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
              defaultValue={this.state.selectedCentre}
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
          {manager
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

function mapStateToProps(state, props) {
  return {
    student: find(state.students, { key: props.params.studentId }),
    manager: isManager(state.auth, state.email),
    classes: state.classes,
    selection: state.selection,
    ageGroup: state.ageGroup,
    centres: state.centres
  };
}

export default connect(mapStateToProps)(StudentEdit);
