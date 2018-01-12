import React from 'react'
import {connect} from 'react-redux'
import {Row, Col, Glyphicon} from 'react-bootstrap'
import {boy, girl} from 'styles.css'
import {Link} from 'react-router'
import moment from 'moment'
import truncate from 'lodash/truncate'
import find from 'lodash/find'

class Student extends React.Component {
  render() {
    var {users, auth} = this.props;
    var user = find(users, ['email', auth.email])
    var {childName, key, gender, contact} = this.props.student;
    var truncatedName = truncate(childName, {
  'length': 28});

  return (
      <Row key= {key} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={9} md={9} style={{fontSize: '14px'}}>
          <Glyphicon glyph="user" /> <font className={gender}>{truncatedName}</font>
        </Col>
        <Col xs={3} md={3} style={{textAlign:'right'}}>
          {user.assignedRoles==='Manager'?<a className="innerbtn" href={"tel:+65"+contact}><Glyphicon glyph="earphone" /> </a>:null}
          <Link to={"/m/students/edit/"+ key}><button className="innerbtn"><Glyphicon glyph="chevron-right" /> </button></Link>
        </Col>
      </Row>

    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
    auth: state.auth
  }
}

export default connect(mapStateToProps)(Student);
