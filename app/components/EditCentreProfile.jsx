import React from 'react'
import {Grid,Row,Panel,Col,FormControl,ControlLabel, FormGroup, Button, HelpBlock,Image, Modal} from 'react-bootstrap'
import {btn} from 'styles.css'
import TermDatesSelector from 'TermDatesSelector'
import {browserHistory} from 'react-router'
import TermList from 'TermList'

var actions = require('actions');
var {connect} = require('react-redux');
var _ = require('lodash');

export var EditCentreProfile = React.createClass({
  getInitialState: function() {
    return {
      errorID: null,
      errorName: null,
      errorTermName: null,
      errorMessageID : '',
      errorMessageName: '',
      errorMessageTermName: '',
      logoURL: '',
      showModal: false
    };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },


  handleChange(e) {
    e.preventDefault();
    this.setState({
      logoURL: e.target.value
    });
  },

  saveTerm(e, centre) {
    e.preventDefault();
    var {dispatch, terms} = this.props;
    var termName = document.getElementById("termName").value;
    if (termName === "") {
      this.setState({
        errorTermName: 'error',
        errorMessageTermName: 'Field Empty. Please enter Term Name'
      });
    }
    else {
      this.setState({
        errorTermName: null,
        errorMessageTermName: ''
      });
      console.log(centre);
      if (typeof centre.term != 'undefined') {
        centre.terms[centre.terms.length] = {name: termName, terms};
      }
      else {
        centre.terms = [];
        centre.terms[0] = {name: termName, terms};
      }
      dispatch(actions.saveTerm(centre));
      this.setState({showModal: false});
    }
  },

  formSubmit(e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var centreID = document.getElementById('centreID').value;
    var centreName = document.getElementById('centreName').value;
    var logoURL = document.getElementById('logoURL').value;
    var count = 0;
    if (centreID === '') {
      this.setState({
        errorID: 'error',
        errorMessageID: 'Field Empty. Please enter Centre ID'
      });
      count += 1;
    }
    else {
      this.setState({
        errorID: null,
        errorMessageID : ''
      })
    }
    if (centreName === '') {
      this.setState({
        errorName: 'error',
        errorMessageName: 'Field Empty. Please enter Centre Name'
      });
      count += 1;
    }
    else {
      this.setState({
        errorName: null,
        errorMessageName : ''
      })
    }

    var currentCentreID = this.props.params.centreID;
    if (currentCentreID === '0'){
      var centreExist = _.findIndex(centres, (c) => {return c.id === centreID});
      if (centreExist === -1) {
        this.setState({
          errorID: null,
          errorMessageID: ''
        });
      var centre = {
        id: centreID,
        name: centreName,
        logoURL: logoURL,
        terms: centres[centreExist].terms
      };
      dispatch(actions.addCentre(centre));
      browserHistory.push('/m/centres');
      }
      else {
        this.setState({
          errorID: 'error',
          errorMessageID : 'Centre ID exist. Please choose another Centre ID.'
        });
      }
    }

    else if (count === 0) {
        var selectedCentre = _.find(centres, {id: centreID});
        var centre = {
          key: selectedCentre.key,
          id: centreID,
          name: centreName,
          logoURL: logoURL,
          terms: selectedCentre.terms
        };
        dispatch(actions.updateCentre(centre));
        browserHistory.push('/m/centres');
    }

  },

  componentDidMount() {
    var {dispatch} = this.props;
    var centreID = this.props.params.centreID;
    this.setState({
      logoURL: document.getElementById('logoURL').value
    });
    if (centreID === '0') {
      dispatch(actions.updateNavTitle("/m/centres", "Add Centre"));
    }
    else {
      dispatch(actions.updateNavTitle("/m/centres", "Edit Centre"));
    }

  },

  render: function () {
    var centreID = this.props.params.centreID;
    var centre = {id: '', name: '', logoURL: '', terms: []};
    var {centres} = this.props;
    if (centreID != '0') {
      centres.map((c) => {
        if(c.id === centreID) {
          centre = c;
        }
      });
    }
    else {
      centre = {id: '', name: '', logoURL: '', terms: []};
    }

   return (
     <div>
       <Grid>
         <Row>
           <Col md={6}>
            <FormGroup validationState={this.state.errorID}>
              <ControlLabel>Centre ID</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="centreID"
              type="text"
              placeholder="Enter Centre ID"
              disabled={centre.id === '' ? false : true}
              defaultValue={centre.id}/>
            <HelpBlock>{this.state.errorMessageID}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={this.state.errorName}>
              <ControlLabel>Centre Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="centreName"
              type="text"
              placeholder="Enter Centre Name"
              defaultValue={centre.name}/>
            <HelpBlock>{this.state.errorMessageName}</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Logo URL</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="logoURL"
              type="text"
              placeholder="Enter Logo URL"
              defaultValue={centre.logoURL} onChange={this.handleChange}/>
            </FormGroup>
            <Image src={this.state.logoURL} style={{width:'100%'}}/>
          </Col>
           <Col md={6}>
             <button className="btn" style={{backgroundColor: '#f5bb05', marginBottom: '5px'}} onClick={this.open}>Add Term</button>
             <div>
              <TermList centreId={centreID}/>
             </div>
             <button className="btn" style={{width: '100%', margin: '0'}} onClick={this.formSubmit}>Save Centre Profile</button>
           </Col>
         </Row>
       </Grid>
       <Modal show={this.state.showModal} onHide={this.close}>
         <Modal.Header closeButton>
           <Modal.Title>Add Term</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <FormGroup validationState={this.state.errorTermName}>
             <ControlLabel>Term Name</ControlLabel>
             <FormControl style={{marginBottom: '10px'}}
             id="termName"
             type="text"
             placeholder="Enter Name of Term"/>
           <HelpBlock>{this.state.errorMessageTermName}</HelpBlock>
           </FormGroup>
          <TermDatesSelector />
         </Modal.Body>
         <Modal.Footer>
           <Button onClick={this.close}>Close</Button>
           <Button onClick={(e) => this.saveTerm(e, centre)}>Save</Button>
         </Modal.Footer>
       </Modal>
     </div>

   );
 }
 });

 export default connect((state) => {return state;
})(EditCentreProfile);
