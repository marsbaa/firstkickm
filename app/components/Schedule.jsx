import React from 'react';
import {Link} from 'react-router'
import {FormGroup, ControlLabel} from 'react-bootstrap'
import {connect} from 'react-redux';
var actions = require('actions');
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export var Schedule = React.createClass({
  getInitialState: function() {
    return {
      value: [],
      previousValue: [],
      options : []
    };
  },
  handleSelectChange (value) {
      var {dispatch} = this.props;
      var date = this.props.date;
      var classKey = this.props.classKey;
      dispatch(actions.toggleSchedule(classKey, date, value));
      this.props.onUpdateList(value);
  		this.setState({ value });

  	},

  componentWillMount(){
    this.setState({value: this.props.assigned});
  },

  componentDidMount() {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/coachschedule", "Coach Scheduling"));
  },

  render: function () {
      var cla = this.props.cla;
      var className = cla.ageGroup + " " + cla.startTime + " " + cla.endTime;
   return (
           <FormGroup>
             <ControlLabel>{className}</ControlLabel>
              <Select
                   name="form-field-name"
                   multi={true}
                   value={this.state.value}
                   options={this.props.coachOptions}
                   onChange={this.handleSelectChange}
               />
           </FormGroup>

   );
 }
 });

 export default connect((state) => {return state;
})(Schedule);
