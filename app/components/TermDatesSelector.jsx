import React from 'react';
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'
import TermTabs from 'TermTabs'

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


  render: function () {
   return (
     <div>
       <FormGroup controlId="formControlsSelect">
        <ControlLabel>No. of Terms per year</ControlLabel>
        <FormControl componentClass="select" placeholder="select" onChange={this.handleChange}>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </FormControl>
      </FormGroup>
       <TermTabs terms={this.state.terms} />
     </div>

   );
 }
 });

 export default (TermDatesSelector);
