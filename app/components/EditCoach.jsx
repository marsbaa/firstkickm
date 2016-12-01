import React from 'react'
var {connect} = require('react-redux')
import {Grid, Row, Col, Glyphicon, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
var actions = require('actions')
import moment from 'moment'
import {Link} from 'react-router'
import _ from 'lodash'

export var EditCoach = React.createClass({
  render: function() {
    var coachId = this.props.params.coachId;
    var {coaches} = this.props;
    var coach = _.find(coaches, {key: coachId});

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
           id="nric"
           componentClass="textarea"
           placeholder="Enter Address"
           defaultValue={coach.address}/>
         </FormGroup>
           <FormGroup>
             <ControlLabel>Bank</ControlLabel>
              <FormControl componentClass="select" defaultValue={coach.bank}>
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
           />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Payment Rate</ControlLabel>
             <FormControl componentClass="select" defaultValue={coach.paymentRate}>
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
             <FormControl componentClass="select" defaultValue={coach.firstAid}>
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
