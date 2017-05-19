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

class PaymentCheck extends React.Component {

  componentDidMount () {
    var {dispatch, students, selection, payments} = this.props;
    dispatch(actions.updateNavTitle("/m/payment", selection.name+" Payment Check"));

    var filteredStudents = StudentsFilter.filter(students, selection.id, '');
    Object.keys(payments).map((paymentId) => {
      var payment = payments[paymentId]
      var student = _.find(filteredStudents, {'key': payment.childKey})
      if (student !== undefined) {
        var record = _.find(student.payments, {'paymentKey':payment.key})
        if (record === undefined) {
           dispatch(actions.addStudentPayment(payment))
        }
        else{
          console.log(record)
        }
      }

    })
  }

  render() {



   return (
     <div>
       Hello
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(PaymentCheck);
