import React from 'react';
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'
import TermTabs from 'TermTabs'
var actions = require('actions');
var {connect} = require('react-redux');

export var TermDatesSelector = React.createClass({
  getInitialState: function() {
    return {
      terms : 6
    };
  },

  handleChange(e, value) {
    e.preventDefault();
    this.setState(
      {
        terms : e.target.value
      }
    )
  },

  componentWillMount() {
    var numOfTerms = this.props.numOfTerms;
    this.setState({terms: numOfTerms});
  },

  componentDidMount() {
    document.getElementById("selectNumOfTerms").value = this.state.terms;
  },


  render: function () {

   return (
     <div>
       <FormGroup>
        <ControlLabel>No. of Terms per year</ControlLabel>
        <FormControl id="selectNumOfTerms" componentClass="select" placeholder="select" onChange={this.handleChange}>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </FormControl>
      </FormGroup>
       <TermTabs numOfTerms={this.state.terms} mode={this.props.mode}/>
     </div>

   );
 }
 });

 export default connect ()(TermDatesSelector);
