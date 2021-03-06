import React from 'react'
var {connect} = require('react-redux')
import {Grid, Row, Col, Glyphicon, Form, FormGroup, FormControl, ControlLabel, ButtonGroup, Button} from 'react-bootstrap'
var actions = require('actions')
import moment from 'moment'
import {Link} from 'react-router'
import _ from 'lodash'
import {browserHistory} from 'react-router'

class UserEdit extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      assignedCentres : [],
      assignedRoles : '',
      roles : [
        "Administrator", "Head Coach", "Coach", "Manager"
      ]
    }
  }

  formSubmit(e) {
    e.preventDefault();
    var userId = this.props.params.userId
    var {dispatch} = this.props;
    var user = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      assignedCentres: this.state.assignedCentres,
      assignedRoles: this.state.assignedRoles
    };
    if (userId === "add") {
      dispatch(actions.addUser(user));
      browserHistory.push('/m/users');
    }
    else {
      dispatch(actions.updateUser(user, userId));
      browserHistory.push('/m/users')
    }

  }

  handleCentreChange(e, centreKey) {
    e.preventDefault();
    var selected = this.state.assignedCentres
    if (e.target.className === "datebtn") {
      e.target.className = "downbtn"
      selected.push(centreKey)
    }
    else if (e.target.className === "downbtn"){
      e.target.className = "datebtn"
      var index = _.findIndex(selected, (c) => {
        return c == centreKey
      })
      _.pullAt(selected, index)
    }
    this.setState({assignedCentres: selected})
  }

  handleRoleChange(e, role) {
    e.preventDefault();

    this.setState({assignedRoles: role})
  }

  componentWillMount() {
    var {users} = this.props;
    var userId = this.props.params.userId
    var user = _.find(users, {'key': userId})
    if (user !== undefined) {
      this.setState({
        assignedRoles: user.assignedRoles === undefined ? '': user.assignedRoles,
        assignedCentres: user.assignedCentres === undefined ? [] : user.assignedCentres
      })
    }

  }


  render() {
    var {centres, users} = this.props;
    var userId = this.props.params.userId
    var user = _.find(users, {'key': userId})
    if (user === undefined) {
      user = {
        name: '',
        email: '',
        assignedRoles: '',
        assignedCentres: []
      }
    }
    var centrehtml = [];
    var roleshtml = [];
    Object.keys(centres).map((centreKey)=> {
      var centre = centres[centreKey]
      var btnClass = "datebtn"
      if (user.assignedCentres !== undefined) {
        if (user.assignedCentres.indexOf(centre.key) > -1) {
          btnClass = "downbtn"
        }
      }
      centrehtml.push(
        <button className={btnClass} key={centreKey} style={{borderRadius: '0', width: '25%', margin : '0px', height: '40px'}} onClick={(e) => { this.handleCentreChange(e, centreKey)}}>
          {centre.name}
        </button>)
      })
      this.state.roles.map((role) => {
        var rolesBtnClass = "datebtn"
        if (user.assignedRoles === role) {
         rolesBtnClass = "downbtn"
        }
        roleshtml.push(<Button className="datebtn" key={role} active={this.state.assignedRoles === role} style={{borderRadius: '0', width: '50%', margin : '0px', height: '40px'}} onClick={(e) => { this.handleRoleChange(e, role)}}>{role}</Button>)
      })


    return (
      <div>
        <Row style={{padding: '10px'}}>
          <Col md={6} xs={12}>
            <FormGroup>
              <ControlLabel>User Email</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="email"
              type="text"
              placeholder="Enter User's Email"
              defaultValue={user.email}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="name"
              type="text"
              placeholder="Enter Full Name"
              defaultValue={user.name}/>
            </FormGroup>
          </Col>
          <Col md={6} xs={12}>
            <div>
              <ControlLabel>Assigned Centres</ControlLabel>
              <div>
                {centrehtml}
              </div>
            </div>
            <div style={{marginTop: '15px'}}>
              <ControlLabel>Roles</ControlLabel>
              <div>
                <ButtonGroup style={{width: '100%'}}>
                  {roleshtml}
                </ButtonGroup>
              </div>
            </div>
          </Col>
          <Col md={12} xs={12} style={{marginTop: '20px', marginBottom: '30px'}}>
            <button className="btn" style={{width: '100%', margin: '0'}} onClick={this.formSubmit.bind(this)}>Save User Profile</button>
          </Col>
        </Row>
      </div>
    )
  }
}


export default connect((state) => {return state;
})(UserEdit);
