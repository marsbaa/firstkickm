import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon, Checkbox} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'

class CoachAttendee extends React.Component {
  render() {
    var {dispatch} = this.props;
    var {name, key, attendance, paymentRate} = this.props.coach;
    var classKey = this.props.classKey;
    var truncatedName = _.truncate(name, {
  'length': 28});
    var date = moment().format("YYYY-MM-DD");
    var attended=false;
    if (attendance !== undefined) {
      if (attendance[date] !== undefined) {
        attended = attendance[date].attended;
      }
    }


  return (
      <Row key= {key} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={9} md={9} style={{fontSize: '14px'}}>
          <div onClick={(e)=> {
              e.preventDefault()
              dispatch(actions.updateCoachAttendance(date, key, classKey, paymentRate))
            }}>
            <Checkbox name="attendSwitch"
              style={{marginRight: '5px'}}
              checked={attended}>
              <Glyphicon glyph="user" /> {truncatedName}
            </Checkbox>

          </div>

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
