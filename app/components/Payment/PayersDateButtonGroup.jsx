import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { insertPayersDate, removePayersDate } from 'actions';

class PayersDateButtonGroup extends React.Component {
  handleChange(e, date) {
    const { dispatch, termId, payerKey } = this.props;
    if (e.target.className === 'btnon') {
      dispatch(removePayersDate(date, termId, payerKey));
      e.target.className = 'btnoff';
    } else {
      dispatch(insertPayersDate(date, termId, payerKey));
      e.target.className = 'btnon';
    }
  }

  render() {
    const { termDates, termId } = this.props;
    return (
      <ButtonGroup style={{ width: '100%' }}>
        {termDates.map(date => {
          return (
            <button
              className="btnon"
              key={date}
              style={{ width: '25%', margin: '0px', height: '40px' }}
              onClick={e => this.handleChange(e, date)}
            >
              {moment(date).format('D MMM')}
            </button>
          );
        })}
      </ButtonGroup>
    );
  }
}

export default connect()(PayersDateButtonGroup);
