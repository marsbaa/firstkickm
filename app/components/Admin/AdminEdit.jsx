import React from 'react'
var {connect} = require('react-redux')
import {Grid, Row, Col, Glyphicon, Form, FormGroup, FormControl, ControlLabel, Modal, Button} from 'react-bootstrap'
var actions = require('actions')
import moment from 'moment'
import {Link} from 'react-router'
import _ from 'lodash'
import {browserHistory} from 'react-router'

class AdminEdit extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      showModal : false
    }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this.deleteAdmin = this.deleteAdmin.bind(this)
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  formSubmit(e) {
    e.preventDefault();
    var {dispatch} = this.props;
    var adminId = this.props.params.adminId;
    var admin = {
      shortName: document.getElementById('shortName').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      dateOfBirth: document.getElementById('dateOfBirth').value,
      contact: document.getElementById('contact').value,
      occupation: document.getElementById('occupation').value,
      address: document.getElementById('address').value,
      bank: document.getElementById('bank').value,
      accountNumber: document.getElementById('accountNumber').value,
      nric: document.getElementById('nric').value,
      education: document.getElementById('education').value
    };
    if (adminId === "add") {
      dispatch(actions.addAdmin(admin));
      browserHistory.push('/m/admins');
    }
    else {
      dispatch(actions.updateAdmin(adminId, admin));
      browserHistory.push('/m/admins');
    }

  }

  deleteAdmin(e) {
    e.preventDefault()
    var {dispatch} = this.props
    var adminId = this.props.params.adminId;
    dispatch(actions.deleteAdmin(adminId))
    browserHistory.push('/m/admins')
  }

  render() {
    var adminId = this.props.params.adminId;
    var admin = {}
    if (adminId === "add") {
      admin = {
        shortName: "",
        name: "",
        email: "",
        contact: "",
        dateOfBirth: "",
        occupation: "",
        address: "",
        bank: "select",
        accountNumber: "",
        nric: "",
        education: ""
      }
    }
    else {
      var {admins} = this.props;
      admin = _.find(admins, {key: adminId});
    }
  return (
    <Grid style={{marginTop: '15px'}}>
      <Row>
        <Col md={6}>
          <FormGroup>
            <ControlLabel>Short Name</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="shortName"
            type="text"
            placeholder="Admin Short Name"
            defaultValue={admin.shortName}/>
          </FormGroup>
         <FormGroup>
           <ControlLabel>Full Name</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="name"
           type="text"
           placeholder="Admin Name"
           defaultValue={admin.name}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Email</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="email"
           type="text"
           placeholder="Enter Email"
           defaultValue={admin.email}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Date of Birth</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="dateOfBirth"
           type="text"
           placeholder="Enter Date of Birth"
           defaultValue={admin.dateOfBirth? moment(admin.dateOfBirth).format("DD/MM/YYYY"):''}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Occupation</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="occupation"
           type="text"
           placeholder="Enter Occupation"
           defaultValue={admin.occupation}/>
         </FormGroup>
         <FormGroup>
           <ControlLabel>Address</ControlLabel>
           <FormControl style={{marginBottom: '10px'}}
           id="address"
           componentClass="textarea"
           placeholder="Enter Address"
           defaultValue={admin.address}/>
         </FormGroup>
           <FormGroup>
             <ControlLabel>Bank</ControlLabel>
              <FormControl id="bank" componentClass="select" defaultValue={admin.bank}>
                <option value="select">Select</option>
                <option value="DBS">DBS</option>
                <option value="POSB">POSB</option>
                <option value="OCBC">OCBC</option>
                <option value="UOB">UOB</option>
              </FormControl>
              <FormControl id="accountNumber" type="text" placeholder="Enter Account Number" defaultValue={admin.accountNumber} />
           </FormGroup>


       </Col>
        <Col md={6}>
          <FormGroup>
            <ControlLabel>NRIC</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="nric"
            type="text"
            placeholder="Enter NRIC"
            defaultValue={admin.nric}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Contact Number</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="contact"
            type="text"
            placeholder="Enter Contact Number"
            defaultValue={admin.contact}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Education Level</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="education"
            type="text"
            placeholder="Enter Education Level"
            defaultValue={admin.education}/>
          </FormGroup>
          <button className="submitbtn"  onClick={this.formSubmit.bind(this)}>Save Admin Profile</button>
          {adminId === 'add' ? [] : <button className="submitbtn" style={{backgroundColor: 'red', marginTop: '20px'}} onClick={this.open}>Delete Admin Profile</button>}
        </Col>
      </Row>
      <Modal show={this.state.showModal} onHide={this.close}>
      <Modal.Header closeButton>
        <b>Delete Administrator</b>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete administrator {admin.name} ?
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.deleteAdmin}>Yes</Button>
        <Button onClick={this.close}>No</Button>
      </Modal.Footer>
    </Modal>
    </Grid>

  );
}
}


export default connect((state) => {return state;
})(AdminEdit);
