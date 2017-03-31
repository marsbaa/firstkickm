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
import moment from 'moment'

class StudentList extends React.Component {


  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/students", selection.name));
  }



  render() {
    var {students, searchText, selection} = this.props;

    var html=[];
    var filteredStudents = StudentsFilter.filter(students, selection.id, searchText);
    if (filteredStudents.length !== 0) {
      var groupTime = _.groupBy(filteredStudents, 'currentClassTime');
      Object.keys(groupTime).forEach((timeSlot)=> {
        var groupAge = _.groupBy(groupTime[timeSlot], 'ageGroup');
        Object.keys(groupAge).forEach((age)=> {
          var group = groupAge[age];
          html.push( <Row key={age+timeSlot} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
             <Col xs={8} md={8}>
               <h5>{age} {timeSlot}</h5>
             </Col>
               <Col xs={4} md={4} style={{textAlign: 'center'}}>
                 <h5>Class Size: {_.size(group)}</h5>
             </Col>
           </Row>);

           Object.keys(group).forEach((studentId) => {
               html.push(<Student key={group[studentId].key} student={group[studentId]}/>);

           })
        })
      })
    }

   return (
     <div>

       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={8} md={8}>
           <Search type="student" />
         </Col>
         <Col xs={4} md={4}>
         <Link to="/m/students/add"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}}>Add Student</button></Link>
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(StudentList);
