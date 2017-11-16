import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateNavTitle, startStudents } from 'actions';
import { paidTerm } from 'helper';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import ListHeader from 'ListHeader';
import ListContent from 'ListContent';

class TotalCollectionBreakdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '5'
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(updateNavTitle('/m/totalbreakdown', 'Total Collection Breakdown'));
  }

  render() {
    const { students, centres } = this.props;
    let html = [];
    let filteredPayments = filter(students, o => {
      return paidTerm(o.payments, this.state.term);
    });
    console.log(filteredPayments);
    let paidAmounts = [];
    filteredPayments.map(student => {
      let studentTotal = 0;
      if (student.payments !== undefined) {
        Object.keys(student.payments).map(paymentKey => {
          if (student.payments[paymentKey].termsPaid !== undefined) {
            if (
              student.payments[paymentKey].termsPaid[this.state.term] !==
              undefined
            ) {
              studentTotal += student.payments[paymentKey].total;
            }
          }
        });
        paidAmounts.push({
          total: studentTotal,
          studentKey: student.key,
          payments: student.payments
        });
      }
    });
    console.log(paidAmounts);
    let groupPayments = groupBy(paidAmounts, 'total');
    console.log(groupPayments);
    return <div>Hello</div>;
  }
}

function mapStateToProps(state) {
  return {
    students: state.students,
    centres: state.centres
  };
}

export default connect(mapStateToProps)(TotalCollectionBreakdown);
