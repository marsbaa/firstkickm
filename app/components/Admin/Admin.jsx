import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'

class Admin extends React.Component{
  render() {
    var {name, key,email} = this.props.admin;
    var truncatedName = _.truncate(name, {
  'length': 28});

  return (
      <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={9} md={9} style={{fontSize: '14px'}}>
          <Glyphicon glyph="user" /> {truncatedName} ({email})
        </Col>
        <Col xs={3} md={3} style={{textAlign:'right'}}>
          <Link to={"/m/admins/"+ key}><button className="innerbtn"><Glyphicon glyph="chevron-right" /> </button></Link>
        </Col>
      </Row>

  );
}
}


export default connect((state) => {return state;
})(Admin);
