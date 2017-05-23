import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon, Grid} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'

class MakeUp extends React.Component{

  handleDelete () {
    var {dispatch} = this.props
    var {key} = this.props.makeUp
    dispatch(actions.deleteMakeUp(key))
  }

  render() {
    var {centres} = this.props
    var {fromDate, key, toDate, fromCentre, toCentre, fromClassTimeDay, toClassTimeDay} = this.props.makeUp;
    var {childName} = this.props.student
    var truncatedName = _.truncate(childName, {
  'length': 28});
    var fromC = _.find(centres, {key: fromCentre })
    var toC = _.find(centres, {key: toCentre})

  return (
    <div>
      <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={9} md={9} style={{fontSize: '14px'}}>
          <Glyphicon glyph="user" /> {truncatedName}
        </Col>
        <Col xs={3} md={3} style={{textAlign:'right'}}>
          <button className="innerbtn" onClick={this.handleDelete.bind(this)}><Glyphicon glyph="trash" /> </button>
        </Col>
      </Row>
      <Row style={{padding: '3px 20px', borderBottom: '1px solid #cccccc', fontSize: '8px'}}>
        <Col xs={1} md={1} style={{padding : '0px 5px'}}>
          From
        </Col>
        <Col xs={3} md={3} style={{padding : '0px 5px'}}>
          {moment(fromDate).format('DD MMM YY')}
        </Col>
        <Col xs={8} md={8} style={{padding : '0px 5px'}}>
          {fromC.name} {fromClassTimeDay}
        </Col>
      </Row>
      <Row style={{padding: '3px 20px', borderBottom: '1px solid #cccccc', fontSize: '8px'}}>
        <Col xs={1} md={1} style={{padding : '0px 5px'}}>
          To
        </Col>
        <Col xs={3} md={3} style={{padding : '0px 5px'}}>
          {moment(toDate).format('DD MMM YY')}
        </Col>
        <Col xs={8} md={8} style={{padding : '0px 5px'}}>
          {toC.name} {toClassTimeDay}
        </Col>
      </Row>
    </div>

  )
}
}


export default connect((state) => {return state;
})(MakeUp);
