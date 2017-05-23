import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'
import Switch from 'Switch'

class Attendee extends React.Component {

  render() {
    var {dispatch, date} = this.props;
    date = moment(date).format("YYYY-MM-DD")
    var {childName, key, attendance} = this.props.student;
    var type = this.props.type
    var truncatedName = _.truncate(childName, {
  'length': 28});
    var attended;
    if (attendance !== undefined) {
      if (attendance[date] !== undefined) {
        attended = attendance[date].attended;
      }
      else {
        attended = false
      }
    }
    else {
      attended = false
    }
    var backgroundColor;
    if (type==='normal') {
      backgroundColor = 'none';
    } else if (type==='makeup') {
      backgroundColor = '#ffecb9';
    }
    else if (type==='makeUpFrom') {
      backgroundColor = '#ffbed0';
    }


  return (
      <Row key= {key} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center', backgroundColor}}>
        <Col xs={2} md={2}>
          <Switch name={key+"attended"+date} checked={attended} onChange={()=> {
            dispatch(actions.updateAttendance(date, key))
            }} />
        </Col>
        <Col xs={6} md={6} style={{fontSize: '14px'}}>
          <Glyphicon glyph="user" /> {truncatedName}
        </Col>
        <Col xs={4} md={4} style={{textAlign:'right'}}>
          {type==='makeup'? null:<Link to={"/m/attendance/makeup/"+ key}><button className="innerbtn">Make Up</button></Link>}
          <Link to={"/m/students/edit/"+ key}><button className="innerbtn"><Glyphicon glyph="chevron-right" /> </button></Link>
        </Col>
      </Row>

  );
}
}


export default connect((state) => {return state;
})(Attendee);
