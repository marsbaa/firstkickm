import React from 'react'
import Schedule from 'Schedule'
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

class ScheduleList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      coachOptions: []
    };
  }

  componentWillMount() {
    var {coaches, selection, coachSchedule} = this.props;
    var calendarKey = this.props.calendarKey;
    var date = this.props.date;
    var classes = selection.classes;
    var html = [];
    var coachOptions = [];
    coaches.map((coach) => {
      coachOptions.push({label: coach.name , value: coach.key});
    });

    Object.keys(classes).forEach((classId) => {
      coachSchedule.map((schedule) => {
        var scheduleKey= classId+date;
        if (schedule.scheduleKey === scheduleKey) {
            var assigned = schedule.assigned;
          if (assigned.length !== 0) {
            assigned.map((coach)=>{
              var index = _.findIndex(coachOptions, coach);
              coachOptions.splice(index, 1);
            })
          }

          }
        });
      });
      this.setState({coachOptions});
  }

  onUpdateList(value) {
    var coachOptions = [];
    if (value.length !== 0) {
      value.map((coach) => {
        coachOptions = _.pull(this.state.coachOptions, coach)
      })
    }
    this.setState({coachOptions});
  }

  render() {
    var {selection, coachSchedule} = this.props;
    var calendarKey = this.props.calendarKey;
    var date = this.props.date;
    var classes = selection.classes;
    var html = [];

    Object.keys(classes).forEach((classId) => {
      var assigned = [];
      coachSchedule.map((schedule) => {
        if (schedule.scheduleKey === classId+date) {
          assigned = schedule.assigned
        }
      })
      if (classes[classId].termKey === calendarKey) {
        html.push(<Schedule key={classId} classKey={classId} cla={classes[classId]} date={date}
        assigned = {assigned}
        coachOptions={this.state.coachOptions}
        onUpdateList={this.onUpdateList.bind(this)}/>);
      }
    });
   return (
     <Grid style={{paddingTop: '20px', paddingBottom: '200px'}}>
       <Row style={{padding: '10 0'}}>
         <Col md={12} xs={12}>
           <p style={{textAlign: 'center', fontSize: '14px', fontWeight: '600'}}>{moment(date).format("D MMM YYYY")}</p>
        </Col>
       </Row>
       <Row style={{height: '200px'}}>
         <Col md={12} xs={12}>
           {html}
        </Col>
      </Row>
    </Grid>

   );
  }
}

 export default connect((state) => {return state;
})(ScheduleList);
