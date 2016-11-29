import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Checkbox, Glyphicon} from 'react-bootstrap'
import btn from 'styles.css'

export var Trial = React.createClass({
  render: function() {
    var {id, childName, dateOfBirth, contactNumber, email, gender, dispatch} = this.props;

  return (
    <Row style={{padding: '0px 11px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
      <Col xs={6} md={6}>
        <Checkbox>
          {childName}
        </Checkbox>
      </Col>
      <Col xs={2} md={2}>
        <button className="btn" style={{backgroundColor: 'white', border: '1px solid #656565', color: 'black'}}>Edit</button>
      </Col>
      <Col xs={4} md={4}>
        <button className="btn" style={{backgroundColor: 'white', border: '1px solid #656565', color: 'black'}}>Register</button>
      </Col>
    </Row>
  );
}
});


export default connect((state) => {return state;
})(Trial);
