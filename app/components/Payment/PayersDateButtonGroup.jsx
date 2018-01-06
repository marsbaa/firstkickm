import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { insertPayersDate, removePayersDate } from 'actions';
import find from 'lodash/find'

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
    const { termDates, termId, student } = this.props;
    return (
      <ButtonGroup style={{ width: '100%' }}>
        {termDates.map(date => {
              var attended = false;
              if (student.attendance !== undefined) {
                if (
                  student.attendance[moment(date).format('YYYY-MM-DD')] !==
                  undefined
                ) {
                  if (
                    student.attendance[moment(date).format('YYYY-MM-DD')]
                      .attended
                  ) {
                    attended = true;
                  }
                }
              }
              if (attended) {
                return (
                  <button
                    className="datebtn"
                    key={date}
                    style={{
                      width: '25%',
                      margin: '0px',
                      height: '40px',
                      backgroundColor: 'green'
                    }}
                  >
                    {moment(date).format('D MMM')}
                  </button>
                );
              } else {
                return (
                  <button
                    className="datebtn"
                    key={date}
                    style={{ width: '25%', margin: '0px', height: '40px' }}
                    onClick={e => {
                      this.handleChange(e, date);
                    }}
                  >
                    {moment(date).format('D MMM')}
                  </button>
                );
              }
            })}
        
      </ButtonGroup>
    );
  }
}

function mapStateToProps(state, props) {
    return {
        student: find(state.students, {key: props.payerKey})
    }
}

export default connect(mapStateToProps)(PayersDateButtonGroup);
