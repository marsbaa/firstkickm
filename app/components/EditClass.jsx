import React from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'
import TimePicker from 'react-timepicker';
import moment from 'moment'
var actions = require('actions');
var {connect} = require('react-redux');
import {browserHistory} from 'react-router'
import {Link} from 'react-router'
import 'react-timepicker/timepicker.css';

export var EditClass = React.createClass({
  getInitialState() {
   return {
     startTime: '',
     endTime: ''
   };
 },

  onChangeStartTime(hours,minutes) {
    var time = hours+":"+minutes;
    this.setState({startTime: time});
  },

  onChangeEndTime(hours,minutes) {
    var time = hours+":"+minutes;
    this.setState({endTime: time});
  },

  goBack(e) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    browserHistory.push('/m/centres/'+ centreID);
  },

  saveClass(e) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    browserHistory.push('/m/centres/'+ centreID);
  },

  componentWillMount() {
    var {dispatch} = this.props;
    dispatch(actions.startAgeGroup());
  },

  componentWillUnmount() {
    var {dispatch} = this.props;
    dispatch(actions.resetAgeGroup());
  },

  generateAgeGroups() {
    var {ageGroup} = this.props;
    var html = [];
    html.push(<option key="select" value="select">Select Age Group</option>)
    ageGroup.map((age) => {
      html.push(<option key={age.key} value={age.name}>{age.name}</option>)
    })
    return html;
  },

  render: function () {
    console.log(this.state.startTime)
    console.log(this.state.endTime)
     return (
       <Grid>
         <Row>
           <Col md={6}>
             <FormGroup>
               <ControlLabel>Age Group</ControlLabel>
                 <FormControl id="selectAgeGroup" componentClass="select" placeholder="select" onChange={this.handleChange}>
                   {this.generateAgeGroups()}
                 </FormControl>
             </FormGroup>
             <FormGroup>
               <ControlLabel>Start Time</ControlLabel>
                <TimePicker onChange={this.onChangeStartTime} />
             </FormGroup>
             <FormGroup>
               <ControlLabel>End Time</ControlLabel>
                 <TimePicker onChange={this.onChangeEndTime}/>
             </FormGroup>

             <Button onClick={this.goBack}>Cancel</Button>
             <Button onClick={this.saveClass}>Save</Button>
          </Col>
        </Row>
      </Grid>
     );
   }
});

export default connect((state) => {return state;
})(EditClass);
