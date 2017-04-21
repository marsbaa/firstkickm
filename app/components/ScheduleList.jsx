import React from 'react'
import Schedule from 'Schedule'
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

class ScheduleList extends React.Component{


  render() {
    var {selection, coachSchedule} = this.props;
    var calendarKey = this.props.calendarKey;
    var date = this.props.date;
    var classes = selection.classes;
    var html = []
    Object.keys(classes).forEach((classId) => {
      if (classes[classId].termKey === calendarKey) {
        html.push(<Schedule key={classId} classKey={classId} cla={classes[classId]} date={date}/>)
      }
    })

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
