import React from 'react'
var {connect} = require('react-redux')
import {Grid, Row, Col, Glyphicon, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
var actions = require('actions')
import moment from 'moment'
import {Link} from 'react-router'
import _ from 'lodash'

export var EditCoach = React.createClass({

  formSubmit(e) {
    e.preventDefault();
    var {dispatch} = this.props;
    var coachId = this.props.params.coachId;
    var coach = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      dateOfBirth: document.getElementById('dateOfBirth').value,
      occupation: document.getElementById('occupation').value,
      address: document.getElementById('address').value,
      bank: document.getElementById('bank').value,
      accountNumber: document.getElementById('accountNumber').value,
      qualification: document.getElementById('qualification').value,
      firstAid: document.getElementById('firstAid').value,
      startDate: document.getElementById('startDate').value,
      nric: document.getElementById('nric').value,
      education: document.getElementById('education').value,
      paymentRate: document.getElementById('paymentRate').value
    };
    if (coachId === "add") {
      dispatch(actions.addCoach(coach));
    }
    else {
      dispatch(actions.updateCoach(coachId, coach));
    }

  },

  render: function() {
    var coachId = this.props.params.coachId;
    var coach = {}
    if (coachId === "add") {
      coach = {
        name: "",
        email: "",
        dateOfBirth: "",
        occupation: "",
        address: "",
        bank: "select",
        accountNumber: "",
        qualification: "",
        firstAid: false,
        startDate: "",
        nric: "",
        education: "",
        paymentRate: "select"
      }
    }
    else {
      var {coaches} = this.props;
      coach = _.find(coaches, {key: coachId});
    }
  return (
    <Grid>
      <Row>
        <Col md={6}>
         <FormGroup>
           <ControlLabel>Name</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="name"
           type="text"
           placeholder="Coach Name"
           defaultValue={coach.name}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Email</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="email"
           type="text"
           placeholder="Enter Email"
           defaultValue={coach.email}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Date of Birth</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="dateOfBirth"
           type="text"
           placeholder="Enter Date of Birth"
           defaultValue={moment(coach.dateOfBirth).format("DD/MMM/YYYY")}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Occupation</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="occupation"
           type="text"
           placeholder="Enter Occupation"
           defaultValue={coach.occupation}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Address</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="address"
           componentClass="textarea"
           placeholder="Enter Address"
           defaultValue={coach.address}/>
         </FormGroup>
           <FormGroup>
             <ControlLabel>Bank</ControlLabel>
              <FormControl id="bank" componentClass="select" defaultValue={coach.bank}>
                <option value="select">Select</option>
                <option value="DBS">DBS</option>
                <option value="POSB">POSB</option>
                <option value="OCBC">OCBC</option>
                <option value="UOB">UOB</option>
              </FormControl>
              <FormControl id="accountNumber" type="text" placeholder="Enter Account Number" defaultValue={coach.accountNumber} />
           </FormGroup>


       </Col>
        <Col md={6}>
          <FormGroup>
            <ControlLabel>NRIC</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="nric"
            type="text"
            placeholder="Enter NRIC"
            defaultValue={coach.nric}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Contact Number</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="contactNumber"
            type="text"
            placeholder="Enter Date of Birth"
            defaultValue={coach.contact}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Education Level</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="education"
            type="text"
            placeholder="Enter Education Level"
            defaultValue={coach.education}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Coaching Qualification</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="qualification"
            type="text"
            placeholder="Enter Coaching Qualification"
            defaultValue={coach.qualification}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Start Date</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="startDate"
            type="text"
            placeholder="Enter Start Date"
            defaultValue=""
           />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Payment Rate</ControlLabel>
             <FormControl id="paymentRate" componentClass="select" defaultValue={coach.paymentRate}>
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
             <FormControl id="firstAid" componentClass="select" defaultValue={coach.firstAid}>
               <option value="true">Yes</option>
               <option value="false">No</option>
             </FormControl>
          </FormGroup>
          <button className="btn" style={{width: '100%', margin: '0'}} onClick={this.formSubmit}>Save Coach Profile</button>
        </Col>
      </Row>
    </Grid>

  );
}
});


export default connect((state) => {return state;
})(EditCoach);
