import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import Student from 'Student'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import Search from 'Search'
import _ from 'lodash'

export var AttendanceList = React.createClass({


  componentDidMount () {
    var {dispatch, selection, centres} = this.props;
    var centre;
    centres.map((c) => {
      if(c.id === selection) {
        centre = c;
      }
    });
    dispatch(actions.updateNavTitle("/m/attendance", centre.name+" Attendance"));
  },

  render: function () {
    var {students, searchText, selection} = this.props;
    var filteredStudents = StudentsFilter.filter(students, selection, searchText);
    var html=[];
    if (filteredStudents.length !== 0) {
      var groupTime = _.groupBy(filteredStudents, 'currentClassTime');
      Object.keys(groupTime).forEach((timeSlot)=> {
        var groupAge = _.groupBy(groupTime[timeSlot], 'ageGroup');
        Object.keys(groupAge).forEach((age)=> {
          var group = groupAge[age];
          html.push( <Row key={age+timeSlot} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
             <Col xs={9} md={9}>
               <h5>{age} {timeSlot}</h5>
             </Col>
               <Col xs={3} md={3} style={{textAlign: 'center'}}>
                 <h5><font style={{color: 'white'}}>0</font> / 3
                 </h5>
             </Col>
           </Row>);

           Object.keys(group).forEach((studentId) => {
               html.push(<Student key={group[studentId].childName} student={group[studentId]} />);
           });
        })




      });
    }

   return (
     <div>

       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={12} md={12}>
           <Search type="student" />
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 });

 export default connect((state) => {return state;
})(AttendanceList);
