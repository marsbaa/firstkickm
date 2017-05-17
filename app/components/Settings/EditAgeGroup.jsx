import React from 'react'
var {connect} = require('react-redux')
import {Grid, Row, Col, Glyphicon, Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import {browserHistory} from 'react-router'

class EditAgeGroup extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      errorName: null,
      errorMessageName: ""
    }
    this.formSubmit = this.formSubmit.bind(this)
  }

  formSubmit(e) {
    e.preventDefault();
    var choice = this.props.params.name;
    var {dispatch, ageGroup} = this.props;
    var ageGroupName = document.getElementById('agegroupName').value;
    if (choice === "add") {
      if (ageGroupName === "") {
        this.setState({
          errorName: 'error',
          errorMessageName: 'Field Empty. Please enter Age Group Name'
        });
      }
      else {
        this.setState({
          errorName: null,
          errorMessageName : ''
        })
      }
      var ageGroupExist = _.findIndex(ageGroup, (c) => {return c.name === ageGroupName});
      if (ageGroupExist === -1) {
        this.setState({
          errorName: null,
          errorMessageName: ''
        });

        var ageGroup = {
          name: document.getElementById('agegroupName').value,
          minAge: document.getElementById('minAge').value,
          maxAge: document.getElementById('maxAge').value
        };
       dispatch(actions.addAgeGroup(ageGroup));
       browserHistory.push('/m/settings');
      }
      else {
        this.setState({
          errorName: 'error',
          errorMessageName: 'Age Group Name exist. Please choose another Name.'
        });
      }

    }

    else {
      var ageG = _.find(ageGroup, {name: ageGroupName});
      ageG.minAge = document.getElementById('minAge').value;
      ageG.maxAge = document.getElementById('maxAge').value;
      dispatch(actions.updateAgeGroup(ageG));
      browserHistory.push('/m/settings');
    }


  }

  render() {
    var ageGroupName = this.props.params.name;
    var ageG = {}
    if (ageGroupName === "add") {
      ageG = {
        name: '',
        minAge: '',
        maxAge: ''
      }
    }
    else {
      var {ageGroup} = this.props;
      ageG = _.find(ageGroup, {name: ageGroupName});

    }
  return (
    <Grid>
      <Row>
        <Col md={6}>
          <FormGroup validationState={this.state.errorName}>
            <ControlLabel>Age Group Name</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="agegroupName"
            type="text"
            defaultValue={ageG.name}
            disabled={ageG.name === "" ? false : true}
            placeholder="Enter Name of Age Group"/>
          <HelpBlock>{this.state.errorMessageName}</HelpBlock>
          </FormGroup>
          <FormGroup validationState={this.state.errorTermName}>
            <ControlLabel>Minimum Age</ControlLabel>
            <FormControl style={{marginBottom: '10px'}}
            id="minAge"
            defaultValue={ageG.minAge}
            type="text"/>
          <ControlLabel>Maximum Age</ControlLabel>
          <FormControl style={{marginBottom: '10px'}}
          id="maxAge"
          defaultValue={ageG.maxAge}
          type="text"/>
        </FormGroup>
        <button className="btn" style={{width: '100%', margin: '0'}} onClick={this.formSubmit}>Save Age Group</button>
      </Col>
    </Row>
  </Grid>
  );
}
}


export default connect((state) => {return state;
})(EditAgeGroup);
