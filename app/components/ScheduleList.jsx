import React from 'react'
import Schedule from 'Schedule'
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap'

class ScheduleList extends React.Component{

  render() {
    var {centres, selection} = this.props;
    var calendarKey = this.props.params.calendarKey;
    var centre;
    centres.map((c) => {
      if (c.id === selection) {
        centre = c;
      }
    })
    var classes = centre.classes;
    var html = [];
    Object.keys(classes).forEach((classId) => {
      console.log(calendarKey);
      if (classes[classId].termKey === calendarKey) {
        html.push(<Schedule key={classId} cla={classes[classId]} />);
      }
    });
   return (
     <Grid style={{paddingTop: '20px', paddingBottom: '200px'}}>
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
