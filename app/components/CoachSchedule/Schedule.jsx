import React from 'react';
import {Link} from 'react-router'
import {FormGroup, ControlLabel, Row, Col, Badge} from 'react-bootstrap'
import {connect} from 'react-redux';
var actions = require('actions');
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import moment from 'moment'


class Schedule extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      value: []
    }
  }

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
      this.setState({value})
  	}

  componentWillMount() {
    var {coachSchedule} = this.props;
    var date = this.props.date;
    var assignedCoaches = []
    var classKey = this.props.classKey
    coachSchedule.map((schedule) => {
      if (schedule.scheduleKey === classKey+date) {
          var assigned = schedule.assigned;
          if (assigned.length !== 0) {
            assigned.map((coach)=>{
              assignedCoaches.push(coach.coachKey)
            })
          }

        }
      })
    this.setState({value: assignedCoaches})
  }


  render() {
    var {coaches, coachSchedule, date, classKey, paid, numOfTrials} = this.props;
    var assignedCoaches = []
    var coachOptions = []
    var classTimingClash = (classKey1, classKey2) => {
      var {centres} = this.props
      var class1, class2;
      centres.map((centre) => {
        if(centre.classes !== undefined) {
          Object.keys(centre.classes).map((classId) => {
            if (classId === classKey1) {
              class1 = centre.classes[classId]
            }
            if (classId === classKey2) {
              class2 = centre.classes[classId]
            }
          })
        }
      })

      var st1 = class1.startTime.split(':')
      var et1 = class1.endTime.split(':')
      var st2 = class2.startTime.split(':')
      var et2 = class2.endTime.split(':')
      if (st1[1].endsWith('pm')) {
        st1[0] = st1[0] + 12
      }
      if (st2[1].endsWith('pm')) {
        st2[0] = st2[0] + 12
      }
      if (et1[1].endsWith('pm')) {
        et1[0] = et1[0] + 12
      }
      if (et2[1].endsWith('pm')) {
        et2[0] = et2[0] + 12
      }
      if (st2[0] === st1[0]) {
        return true
      }
      else {
        return false
      }

    }
    coaches.map((coach) => {
      coachOptions.push({label: coach.shortName , value: coach.key});
    })
    coachSchedule.map((schedule) => {
      if (schedule.date === date){
        if (classTimingClash(schedule.classKey, classKey) && schedule.classKey !== classKey) {
          schedule.assigned.map((coach) => {
            var index = _.findIndex(coachOptions, {value: coach.coachKey})
            coachOptions.splice(index, 1)
          })
        }
      }
    })
    var cla = this.props.cla;
    var className = cla.ageGroup + " " + cla.startTime + " - " + cla.endTime;


   return (
     <div style={{marginTop: '10px'}}>
       <Row style={{marginBottom:'3px'}}>
         <Col xs={7} md={7} lg={7}>
           <b>{className}</b>
         </Col>
         <Col xs={5} md={5} lg={5}>
           P <Badge style={{backgroundColor:'#f5bb05', color: 'black'}}>{paid}</Badge>
         {numOfTrials === 0 ? '' : <font> T <Badge>{numOfTrials}</Badge></font> }
         </Col>
       </Row>
       <Row>
         <Col xs={12} md={12} lg={12}>
           <Select
                name="form-field-name"
                multi={true}
                value={this.state.value}
                options={coachOptions}
                onChange={this.handleSelectChange.bind(this)}
            />
         </Col>
       </Row>
     </div>
   );
 }
 }

 export default connect((state) => {return state;
})(Schedule);
