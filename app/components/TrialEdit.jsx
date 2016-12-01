import React from 'react';
var {connect} = require('react-redux');
var actions = require('actions');
import {Row, Col} from 'react-bootstrap'

export var TrialEdit = React.createClass({

  render: function () {
    var key = this.props.params.key;
    var {trials} = this.props;
    var trial = _.find(trials, {id: key});
    
    return (
        <Row style={{padding: '10px'}}>
          <Col xs={6} md={6}>
            <label>Child's Name
                  <input id="childName" type="text" defaultValue={trial.childName}/>
                </label>
                <label>Mobile Number
                  <input id="contactNumber" type="text" defaultValue={trial.contactNumber}/>
                </label>
                <label>Email
                  <input id="email" type="text" defaultValue={trial.email}/>
                </label>
                <label>Gender</label>
                  <input type="radio" name="gender" id="boy" defaultChecked/><label for="boy">Boy</label>
                  <input type="radio" name="gender" id="girl" required /><label for="girl" >Girl</label>
                <label>Date of Birth (YYYY-MM-DD)
                  <input id="dateOfBirth" type="text" defaultValue={trial.dateOfBirth}/>
                </label>
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
