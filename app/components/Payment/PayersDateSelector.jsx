import React from 'react';
import PayersDateSelectorPanel from 'PayersDateSelectorPanel';
import { connect } from 'react-redux';
import { addPayersDates } from 'actions';

class PayersDateSelector extends React.Component {
  componentWillMount() {
    const { dispatch, sessionDates, payerKey } = this.props;
    dispatch(addPayersDates(sessionDates, payerKey));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate !== this.props.startDate) {
      const { dispatch, payerKey } = this.props;
      const { sessionDates } = nextProps;
      dispatch(addPayersDates(sessionDates, payerKey));
    }
  }

  render() {
    const { sessionDates, payerKey, dates } = this.props;
    return (
      <div>
        {dates !== undefined
          ? Object.keys(sessionDates).map(termId => {
              const termDates = sessionDates[termId];
              return (
                <PayersDateSelectorPanel
                  key={termId}
                  selectedDates={dates[termId]}
                  termDates={termDates}
                  termId={termId}
                  payerKey={payerKey}
                />
              );
            })
          : null}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    dates: state.payers[props.payerKey].sessionDates
  };
}

export default connect(mapStateToProps)(PayersDateSelector);
