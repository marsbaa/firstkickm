import React from 'react'
var {connect} = require('react-redux')
var actions = require('actions')
import {Row, Col, FormControl, FormGroup, ControlLabel, Radio} from 'react-bootstrap'

export var TrialEdit = React.createClass({

  render: function () {
    var key = this.props.params.studentId;
    var {trials,centres} = this.props;
    var trial = _.find(trials, {id: key});

    //Centre List
    var centreOptions = [];
    centreOptions.push(<option key="0" value="0">select</option>);
    centres.map((centre) => {
      centreOptions.push(<option key={centre.id} value={centre.id}>{_.upperFirst(centre.name)}</option>);
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
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="Email"
              type="text"
              placeholder="Enter Email"
              defaultValue={trial.email}/>
            </FormGroup>
            <FormGroup>
              <Radio name="gender" inline>
                Boy
              </Radio>
              {' '}
              <Radio name="gender" inline>
                Girl
              </Radio>
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
              <ControlLabel>Selected Centre</ControlLabel>
              <FormControl
                id="centreSelect" componentClass="select" placeholder="select"
                defaultValue={trial.venueId}>
                {centreOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Class Time</ControlLabel>
              <FormControl
                id="selectedTimeSlot" componentClass="select" placeholder="select"
                defaultValue={trial.timeOfTrial}>
                  <option value="0">select</option>
              </FormControl>
            </FormGroup>
          </Col>
        </Row>
    );
  }
});

export default connect(
  (state) => {
    return state;
  }
)(TrialEdit);
