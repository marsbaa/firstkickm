import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'

class AgeGroup extends React.Component{
  render() {
    var {name, minAge, maxAge} = this.props.a;

  return (
      <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={3} md={3} style={{fontSize: '14px'}}>
          <Glyphicon glyph="certificate" /> {name}
        </Col>
        <Col xs={6} md={6} style={{fontSize: '14px'}}>
          {minAge} to {maxAge} years old
        </Col>
        <Col xs={3} md={3} style={{textAlign:'right'}}>
           <Link to={"/m/settings/ageGroup/" + name}><button className="innerbtn"><Glyphicon glyph="pencil" /> </button></Link>

        </Col>
      </Row>

  );
}
}


export default connect((state) => {return state;
})(AgeGroup);
