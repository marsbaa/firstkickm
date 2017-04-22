import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'

class JerseyIssued extends React.Component{
  render() {
    var {childName, childKey, jerseySize, issuedDate} = this.props.student;
    var truncatedName = _.truncate(childName, {
  'length': 28});

  return (
      <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={6} md={6} style={{fontSize: '14px'}}>
          <Glyphicon glyph="user" /> {truncatedName}
        </Col>
        <Col xs={6} md={6} style={{textAlign:'right'}}>
          <b>Jersey Size : {jerseySize} </b>
          <p style={{fontSize: '8px', marginTop: '0px'}}>issued on {moment(issuedDate).format("DD MMM YYYY")}</p>
        </Col>
      </Row>

  )
}
}


export default connect((state) => {return state;
})(JerseyIssued);
