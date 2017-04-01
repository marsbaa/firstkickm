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
      var {dispatch, coaches} = this.props;
      var date = this.props.date;
      var classKey = this.props.classKey;
      var attended = []
      Object.keys(value).map((coachId) => {
         var index = _.findIndex(coaches, {key : value[coachId].value});
         if (index !== -1) {
           var coach = coaches[index]
           attended.push({
             name: coach.name,
             coachKey : coach.key,
             paymentRate: coach.paymentRate
           })
         }
      })
      dispatch(actions.toggleSchedule(classKey, date, attended));
      this.props.onUpdateList(value, this.state.value);
      this.setState((prevState) => {
          return {previousValue: prevState.value, value};
      });
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
