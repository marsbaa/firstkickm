import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import Payer from 'Payer'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import Search from 'Search'
import _ from 'lodash'
import moment from 'moment'

class PaymentList extends React.Component {


  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/payment", selection.name+" Payment"));
  }



  render() {
    var {students, searchText, selection} = this.props;
    var html=[];
    var filteredStudents = StudentsFilter.filter(students, selection.id, searchText);
    var actualStudents = StudentsFilter.filter(students, selection.id, "");
    if (filteredStudents.length !== 0) {
      var groupTime = _.groupBy(filteredStudents, 'currentClassTime');
      var actualGroupTime = _.groupBy(actualStudents, 'currentClassTime')
      Object.keys(groupTime).forEach((timeSlot)=> {
        var groupAge = _.groupBy(groupTime[timeSlot], 'ageGroup');
        var actualGroupAge = _.groupBy(actualGroupTime[timeSlot], 'ageGroup');
        Object.keys(groupAge).forEach((age)=> {
          var group = groupAge[age];
          var actualGroup = actualGroupAge[age];
          html.push( <Row key={age+timeSlot} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
             <Col xs={8} md={8}>
               <h5>{age} {timeSlot}</h5>
             </Col>
               <Col xs={4} md={4} style={{textAlign: 'center'}}>
                 <h5>Class Size: {_.size(actualGroup)}</h5>
             </Col>
           </Row>);

           Object.keys(group).forEach((studentId) => {
               html.push(<Payer key={group[studentId].key} student={group[studentId]}/>);

           })
        })
      })
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
 }

 export default connect((state) => {return state;
})(PaymentList);
