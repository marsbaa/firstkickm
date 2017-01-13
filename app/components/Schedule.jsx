import React from 'react';
import {Link} from 'react-router'
import {FormGroup, ControlLabel, Grid, Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
var actions = require('actions');
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export var Schedule = React.createClass({
  getInitialState: function() {
    return {
      value: [],
      options : []
    };
  },
  handleSelectChange (value) {
  		console.log('You\'ve selected:', value);
  		this.setState({ value });
  	},

  componentDidMount() {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/coachschedule", "Coach Scheduling"));
  },

  render: function () {
      var {dispatch, coaches} = this.props;
      var coachOptions = [];
      coaches.map((coach) => {
        coachOptions.push({label: coach.name, value: coach.key});
      });
      console.log(coachOptions);
   return (
     <Grid style={{paddingTop: '20px'}}>
       <Row style={{height: '200px'}}>
         <Col md={6}>
           <FormGroup>
             <ControlLabel>U6 9:00am - 10:00am</ControlLabel>
              <Select
                   name="form-field-name"
                   multi={true}
                   value={this.state.value}
                   options={coachOptions}
                   onChange={this.handleSelectChange}
               />
           </FormGroup>

         </Col>
       </Row>
     </Grid>

   );
 }
 });

 export default connect((state) => {return state;
})(Schedule);
