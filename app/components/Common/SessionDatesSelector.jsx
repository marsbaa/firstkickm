import React from 'react';
import SessionDatesSelectorPanel from 'SessionDatesSelectorPanel';
import { connect } from 'react-redux';
import { addSessionDates } from 'actions';

class SessionDatesSelector extends React.Component {
  componentWillMount() {
    const { dispatch, sessionDates, payerKey } = this.props;
    dispatch(addSessionDates(sessionDates, payerKey));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate !== this.props.startDate) {
      const { dispatch, payerKey } = this.props;
      const { sessionDates } = nextProps;
      dispatch(addSessionDates(sessionDates, payerKey));
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
                <SessionDatesSelectorPanel
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
    dates: state.register[props.payerKey].sessionDates
  };
}

export default connect(mapStateToProps)(SessionDatesSelector);
