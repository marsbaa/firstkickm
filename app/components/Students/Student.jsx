import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon} from 'react-bootstrap'
import {boy, girl} from 'styles.css'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'

class Student extends React.Component {
  render() {
    var {dispatch} = this.props;
    var {childName, key, gender} = this.props.student;
    var truncatedName = _.truncate(childName, {
  'length': 28});

  return (
      <Row key= {key} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={9} md={9} style={{fontSize: '14px'}}>
          <Glyphicon glyph="user" /> <font className={gender}>{truncatedName}</font>
        </Col>
        <Col xs={3} md={3} style={{textAlign:'right'}}>
          <Link to={"/m/students/edit/"+ key}><button className="innerbtn"><Glyphicon glyph="chevron-right" /> </button></Link>
        </Col>
      </Row>

    );
  }
}


export default connect((state) => {return state;
})(Student);
