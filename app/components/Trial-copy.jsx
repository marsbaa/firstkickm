import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Checkbox, Glyphicon} from 'react-bootstrap'
import {boy, girl, innerbtn} from 'styles.css'
import moment from 'moment'
var actions = require('actions')
import {Link} from 'react-router'
import Switch from 'Switch'

class Trial extends React.Component{
  render () {
    var {id, childName, dateOfBirth, contact, email, gender, dispatch, attended, attendedOn, registered, dateRegistered} = this.props;
    var trialClassName = attended ? 'trialCompleted' : 'trial';
    var truncatedChildName = _.truncate(childName, {
  'length': 18});

    var getAge = (dob) => {
    var now = moment();
    var dateofbirth = moment(JSON.stringify(dob), "YYYY-MM-DD");
    return now.diff(dateofbirth, 'years');
  };
    var registeredHTML = []
    if (registered) {
      registeredHTML.push(
        <Row key={id} style={{backgroundColor: '#d7d7d7', padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={2} md={2}>
            <Switch checked={attended.toString()} onChange={()=> {
                dispatch(actions.startToggleTrial(id));
              }} />
          </Col>
          <Col xs={6} md={6} >
            <div>
                  <font className={trialClassName}>{truncatedChildName} </font><font className={gender}>({getAge(dateOfBirth)})</font>
            </div>
            <div style={{fontSize: '10px', color: '#9a9a9a'}}>
              <Glyphicon style={{color: '#656565'}} glyph="envelope" /> {email.toLowerCase()}
            </div>
            <div style={{fontSize: '10px', color: '#9a9a9a'}}><Glyphicon style={{color: '#656565'}} glyph="phone" /> {contact}
            </div>
          </Col>
          <Col xs={4} md={4} style={{textAlign:'right'}}>
            Registered on {moment(dateRegistered).format('D MMM YYYY')}
          </Col>
        </Row>
        )
    }
    else {
      registeredHTML.push(
        <Row key={id} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={7} md={7} onClick={()=> {
              dispatch(actions.startToggleTrial(id));
            }}>
            <div>
                  <input type="checkbox" checked={attended} name="attendSwitch" style={{marginRight: '5px'}} readOnly/><font className={trialClassName}>{truncatedChildName} </font><font className={gender}>({getAge(dateOfBirth)})</font>
            </div>
            <div style={{paddingLeft: '20px', fontSize: '10px', color: '#9a9a9a'}}>
              <Glyphicon style={{color: '#656565'}} glyph="envelope" /> {email.toLowerCase()}
            </div>
            <div style={{paddingLeft: '20px', fontSize: '10px', color: '#9a9a9a'}}><Glyphicon style={{color: '#656565'}} glyph="phone" /> {contact}
            </div>
          </Col>
          <Col xs={5} md={5} style={{textAlign:'right'}}>
            <Link className="headerlnk" to={"/m/trials/edit/"+id}><button className="innerbtn"><Glyphicon glyph="pencil" /> </button></Link>
            <Link className="headerlnk" to={"/m/trials/register/"+id}><button className="innerbtn" >Register</button></Link>
          </Col>
        </Row>
        )
    }


  return (
    <div>
      {registeredHTML}
    </div>
  );
}
}


export default connect((state) => {return state;
})(Trial);
