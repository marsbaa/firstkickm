import React from 'react';
import {connect} from 'react-redux';
import {
  Grid,
  Row,
  Col,
  Glyphicon,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Button
} from 'react-bootstrap';
import {addCoach, updateCoach} from 'CoachesActions';
import moment from 'moment';
import {Link} from 'react-router';
import find from 'lodash/find';
import {browserHistory} from 'react-router';

class CoachEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.close = this
      .close
      .bind(this);
    this.open = this
      .open
      .bind(this);
    this.deleteCoach = this
      .deleteCoach
      .bind(this);
  }

  close() {
    this.setState({showModal: false});
  }

  open() {
    this.setState({showModal: true});
  }

  formSubmit(e) {
    e.preventDefault();
    let {dispatch} = this.props;
    let coachId = this.props.params.coachId;
    let coach = {
      shortName: document
        .getElementById('shortName')
        .value,
      name: document
        .getElementById('name')
        .value,
      email: document
        .getElementById('email')
        .value,
      dateOfBirth: document
        .getElementById('dateOfBirth')
        .value,
      contact: document
        .getElementById('contact')
        .value,
      occupation: document
        .getElementById('occupation')
        .value,
      address: document
        .getElementById('address')
        .value,
      bank: document
        .getElementById('bank')
        .value,
      accountNumber: document
        .getElementById('accountNumber')
        .value,
      qualification: document
        .getElementById('qualification')
        .value,
      firstAid: document
        .getElementById('firstAid')
        .value,
      startDate: document
        .getElementById('startDate')
        .value,
      nric: document
        .getElementById('nric')
        .value,
      education: document
        .getElementById('education')
        .value,
      paymentRate: document
        .getElementById('paymentRate')
        .value
    };
    if (coachId === 'add') {
      dispatch(addCoach(coach));
      browserHistory.push('/m/coaches');
    } else {
      dispatch(updateCoach(coachId, coach));
      browserHistory.push('/m/coaches');
    }
  }

  deleteCoach(e) {
    e.preventDefault();
    let {dispatch} = this.props;
    let coachId = this.props.params.coachId;
    dispatch(actions.deleteCoach(coachId));
    browserHistory.push('/m/coaches');
  }

  render() {
    const {coach} = this.props;
    let coachId = this.props.params.coachId;
    let coachData = coach;
    if (coachData === undefined) {
      coachData = {
        shortName: '',
        name: '',
        email: '',
        contact: '',
        dateOfBirth: '',
        occupation: '',
        address: '',
        bank: 'select',
        accountNumber: '',
        qualification: '',
        firstAid: false,
        startDate: '',
        nric: '',
        education: '',
        paymentRate: 'select'
      };
    }
    return (
      <Grid style={{
        marginTop: '15px'
      }}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>Short Name</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="shortName"
                type="text"
                placeholder="Coach Short Name"
                defaultValue={coachData.shortName}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Full Name</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="name"
                type="text"
                placeholder="Coach Name"
                defaultValue={coachData.name}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={coachData.email}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Date of Birth</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="dateOfBirth"
                type="text"
                placeholder="Enter Date of Birth"
                defaultValue={moment(coachData.dateOfBirth).format('DD/MM/YYYY')}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Occupation</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="occupation"
                type="text"
                placeholder="Enter Occupation"
                defaultValue={coachData.occupation}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Address</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="address"
                componentClass="textarea"
                placeholder="Enter Address"
                defaultValue={coachData.address}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Bank</ControlLabel>
              <FormControl id="bank" componentClass="select" defaultValue={coachData.bank}>
                <option value="select">Select</option>
                <option value="DBS">DBS</option>
                <option value="POSB">POSB</option>
                <option value="OCBC">OCBC</option>
                <option value="UOB">UOB</option>
                <option value="MAYBANK">MAYBANK</option>
              </FormControl>
              <FormControl
                id="accountNumber"
                type="text"
                placeholder="Enter Account Number"
                defaultValue={coachData.accountNumber}/>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <ControlLabel>NRIC</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="nric"
                type="text"
                placeholder="Enter NRIC"
                defaultValue={coachData.nric}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Contact Number</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="contact"
                type="text"
                placeholder="Enter Contact Number"
                defaultValue={coachData.contact}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Education Level</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="education"
                type="text"
                placeholder="Enter Education Level"
                defaultValue={coachData.education}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Coaching Qualification</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="qualification"
                type="text"
                placeholder="Enter Coaching Qualification"
                defaultValue={coachData.qualification}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Start Date</ControlLabel>
              <FormControl
                style={{
                marginBottom: '10px'
              }}
                id="startDate"
                type="text"
                placeholder="Enter Start Date"
                defaultValue=""/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Payment Rate</ControlLabel>
              <FormControl
                id="paymentRate"
                componentClass="select"
                defaultValue={coachData.paymentRate}>
                <option value="select">Select</option>
                <option value="OJT">OJT</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="70">70</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>First Aid Trained</ControlLabel>
              <FormControl
                id="firstAid"
                componentClass="select"
                defaultValue={coachData.firstAid}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </FormControl>
            </FormGroup>
            <button
              className="submitbtn"
              onClick={this
              .formSubmit
              .bind(this)}>
              Save Coach Profile
            </button>
            {coachId === 'add'
              ? []
              : <button
                className="submitbtn"
                style={{
                backgroundColor: 'red',
                marginTop: '20px'
              }}
                onClick={this.open}>
                Delete Coach Profile
              </button>}
          </Col>
        </Row>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <b>Delete Coach</b>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete coach {coachData.name}
            ?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.deleteCoach}>Yes</Button>
            <Button onClick={this.close}>No</Button>
          </Modal.Footer>
        </Modal>
      </Grid>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    coach: find(state.coaches, {key: props.params.coachId})
  };
}

export default connect(mapStateToProps)(CoachEdit);
