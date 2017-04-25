import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'
import Switch from 'Switch'

class CoachAttendee extends React.Component {
  render() {
    var {dispatch} = this.props;
    var {name, key, attendance, paymentRate} = this.props.coach;
    var classKey = this.props.classKey;
    var truncatedName = _.truncate(name, {
  'length': 20});
    var date = moment(this.props.date).format("YYYYMMDD")
    var attended=false;
    if (attendance !== undefined) {
      if (attendance[date] !== undefined) {
        attended = attendance[date].attended;
      }
    }


  return (
      <Row key= {key} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={2} md={2}>
          <Switch name={key+"attended"} checked={attended.toString()} defaultChecked={attended} onChange={()=> {
              dispatch(actions.updateCoachAttendance(date, key, classKey, paymentRate))
            }} />
        </Col>
        <Col xs={7} md={7} style={{fontSize: '14px'}}>
              <Glyphicon glyph="user" /> {truncatedName}
        </Col>
        <Col xs={3} md={3} style={{textAlign:'right'}}>
          <Link to={"/m/coaches/"+ key}><button className="innerbtn"><Glyphicon glyph="chevron-right" /> </button></Link>
        </Col>
      </Row>

  );
}
}


export default connect((state) => {return state;
})(CoachAttendee);
