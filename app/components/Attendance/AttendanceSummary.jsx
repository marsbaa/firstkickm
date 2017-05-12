import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import Attendee from 'Attendee'
var actions = require('actions');
import _ from 'lodash'
import moment from 'moment'
import AttendanceTable from 'AttendanceTable'

class AttendanceSummary extends React.Component{

  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/attendance/summary", selection.name+" Attendance Summary"));
   }


  render() {
    var {selection} = this.props;
    var classes = selection.classes
    var html = []
    Object.keys(classes).forEach((classKey)=> {
      html.push(<AttendanceTable key={classKey} classes={classes[classKey]} />)
    })

   return (
     <Grid style={{marginTop: '20px'}}>
       <Row>
         <Col xs={12} md={12}>
           {html}
         </Col>
       </Row>

     </Grid>
   );
 }
 }

 export default connect((state) => {return state;
})(AttendanceSummary);
