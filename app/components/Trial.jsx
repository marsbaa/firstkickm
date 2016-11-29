import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Checkbox, Glyphicon} from 'react-bootstrap'
import innerbtn from 'styles.css'
import moment from 'moment'
var actions = require('actions')

export var Trial = React.createClass({
  render: function() {
    var {id, childName, dateOfBirth, contactNumber, email, gender, dispatch, attended, attendedOn} = this.props;
    var trialClassName = attended ? 'trialCompleted' : 'trial';
    var truncatedChildName = _.truncate(childName, {
  'length': 18});
    var getAge = (dob) => {
    var now = moment();
    var dateofbirth = moment(JSON.stringify(dob), "YYYY-MM-DD");
    return now.diff(dateofbirth, 'years');
  };

  return (
      <Row style={{padding: '8px 5px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={7} md={7} onClick={()=> {
            dispatch(actions.startToggleTrial(id));
          }}>
          <div>
                <input type="checkbox" checked={attended} name="attendSwitch" style={{marginRight: '5px'}} readOnly/><font className={trialClassName}>{truncatedChildName} ({getAge(dateOfBirth)})</font>
          </div>
          <div style={{paddingLeft: '15px', fontSize: '10px', color: '#9a9a9a'}}><Glyphicon style={{color: '#656565'}} glyph="phone" /> {contactNumber}
            <Glyphicon style={{color: '#656565',paddingLeft: '10px'}} glyph="envelope" /> {email}
          </div>
        </Col>
        <Col xs={5} md={5} style={{textAlign:'right'}}>
          <button className="innerbtn"><Glyphicon glyph="pencil" /> </button>
          <button className="innerbtn" >Register</button>
        </Col>
      </Row>

  );
}
});


export default connect((state) => {return state;
})(Trial);
