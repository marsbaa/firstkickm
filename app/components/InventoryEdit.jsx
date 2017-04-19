import React from 'react'
var {connect} = require('react-redux')
import {Grid, Row, Col, Glyphicon, Form, FormGroup, FormControl, ControlLabel, ButtonGroup, Button} from 'react-bootstrap'
var actions = require('actions')
import moment from 'moment'
import {Link} from 'react-router'
import _ from 'lodash'
import {browserHistory} from 'react-router'

class InventoryEdit extends React.Component{

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  formSubmit(e) {
    e.preventDefault();
    var itemId = this.props.params.itemId
    var {dispatch} = this.props;
    var item = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      assignedCentres: this.state.assignedCentres,
      assignedRoles: this.state.assignedRoles
    };
    if (userId === "add") {
      dispatch(actions.addUser(item));
      browserHistory.push('/m/inventory');
    }
    else {
      dispatch(actions.updateUser(item, userId));
      browserHistory.push('/m/inventory')
    }

  }

  handleCentreChange(e, centreId) {
    e.preventDefault();
    var selected = this.state.assignedCentres
    if (e.target.className === "datebtn") {
      e.target.className = "downbtn"
      selected.push(centreId)
    }
    else if (e.target.className === "downbtn"){
      e.target.className = "datebtn"
      var index = _.findIndex(selected, (c) => {
        return c == centreId
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
        assignedRoles: user.assignedRoles,
        assignedCentres: user.assignedCentres
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
    centres.map((centre) => {
      var btnClass = "datebtn"
      if (user.assignedCentres.indexOf(centre.id) > -1) {
        btnClass = "downbtn"
      }
      centrehtml.push(<button className={btnClass} key={centre.key} style={{borderRadius: '0', width: '25%', margin : '0px', height: '40px'}} onClick={(e) => { this.handleCentreChange(e, centre.id)}}>{centre.name}</button>)
    })
    this.state.roles.map((role) => {
      var rolesBtnClass = "datebtn"
      if (user.assignedRoles === role) {
       rolesBtnClass = "downbtn"
      }
      roleshtml.push(<Button className="datebtn" key={role} active={this.state.assignedRoles === role}style={{borderRadius: '0', width: '50%', margin : '0px', height: '40px'}} onClick={(e) => { this.handleRoleChange(e, role)}}>{role}</Button>)
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
