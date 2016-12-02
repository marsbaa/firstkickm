import React from 'react'
import {Grid,Row,Panel,Col,FormControl,ControlLabel, FormGroup, Button, HelpBlock} from 'react-bootstrap'
import {btn} from 'styles.css'
import TermDatesSelector from 'TermDatesSelector'
import {browserHistory} from 'react-router'

var actions = require('actions');
var {connect} = require('react-redux');
var _ = require('lodash');

export var EditCentreProfile = React.createClass({
  getInitialState: function() {
    return {
      errorID: null,
      errorName: null,
      errorMessageID : '',
      errorMessageName: ''

    };
  },

  formSubmit(e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var centreID = document.getElementById('centreID').value;
    var centreName = document.getElementById('centreName').value;
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
      console.log(centres);
        var selectedCentre = _.find(centres, {id: centreID});
        var centre = {
          key: selectedCentre.key,
          id: centreID,
          name: centreName,
        };
        dispatch(actions.updateCentre(centre));
        browserHistory.push('/m/centres');
    }

  },

  componentDidMount() {
    var {dispatch} = this.props;
    var centreID = this.props.params.centreID;
    if (centreID === '0') {
      dispatch(actions.updateNavTitle("/m/cp", "Add Centre"));
    }
    else {
      dispatch(actions.updateNavTitle("/m/cp", "Edit Centre"));
    }

  },

  render: function () {
    var centreID = this.props.params.centreID;
    var centre = {id: '', name: ''};
    var {centres} = this.props;
    if (centreID != '0') {
      centre = centres[centreID-1];
    }
    else {
      centre = {id: '', name: ''};
    }

   return (
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
        </Col>
         <Col md={6}>
           <TermDatesSelector />
           <button className="btn" style={{width: '100%', margin: '0'}} onClick={this.formSubmit}>Save Centre Profile</button>
         </Col>
       </Row>
     </Grid>
   );
 }
 });

 export default connect((state) => {return state;
})(EditCentreProfile);
