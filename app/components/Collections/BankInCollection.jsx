import React from 'react';
import { connect } from 'react-redux';
import { updateNavTitle, startPayments, startExpenses } from 'actions';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import size from 'lodash/size';
import moment from 'moment';
import ListHeader from 'ListHeader';
import ListContent from 'ListContent';

class BankInCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().subtract(28, 'days')
    };
  }

  componentWillMount() {
    const { dispatch, payments, expenses } = this.props;
    dispatch(updateNavTitle('/m/bankin', 'Bank In Collection'));
    if (isEmpty(payments)) {
      dispatch(startPayments());
    }
    if (isEmpty(expenses)) {
      dispatch(startExpenses());
    }
  }

  render() {
    const { payments, expenses, centres } = this.props;
    let html = [];
    let filteredPayments = filter(payments, o => {
      return moment(o.date).isAfter(this.state.startDate);
    });
    filteredPayments = filter(filteredPayments, { paymentMethod: 'Cash' });
    filteredPayments = orderBy(filteredPayments, ['date'], ['desc']);
    let paymentsByDate = groupBy(filteredPayments, o => {
      return moment(o.date).format('YYYY-MM-DD');
    });
    Object.keys(paymentsByDate).map(id => {
      const dateGroup = paymentsByDate[id];
      let expensesGroup = filter(expenses, o => {
        return moment(o.date).isSame(id, 'day');
      });
      html.push(
        <ListHeader
          key={id}
          title={'Collections on ' + moment(id).format('Do MMM YYYY')}
        />
      );
      let paymentsByCentre = groupBy(dateGroup, 'centreId');
      Object.keys(paymentsByCentre).map(centreId => {
        const centreGroup = paymentsByCentre[centreId];
        let expensesByCentre = filter(expensesGroup, { centreId: centreId });
        const centreName = find(centres, { id: centreId }).name;
        let total = reduce(
          centreGroup,
          function(sum, n) {
            return sum + n.total;
          },
          0
        );
        if (size(expensesByCentre) !== 0) {
          total -= reduce(
            expensesByCentre,
            function(sum, n) {
              return sum + n.amount;
            },
            0
          );
        }

        html.push(
          <ListContent
            key={id + centreId}
            contentLeft={centreName}
            contentRight={total}
          />
        );
      });
    });
    return (
      <div>
        {html}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    payments: state.payments,
    expenses: state.expenses,
    centres: state.centres
  };
}

export default connect(mapStateToProps)(BankInCollection);
