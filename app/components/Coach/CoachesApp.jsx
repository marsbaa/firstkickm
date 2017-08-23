import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { fetchCoaches } from 'CoachesActions';
import { connect } from 'react-redux';

class CoachesApp extends React.Component {
  componentDidMount() {
    const { dispatch, coaches } = this.props;
    if (isEmpty(coaches)) {
      dispatch(fetchCoaches());
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.isFetching,
    coaches: state.coaches
  };
}

export default connect(mapStateToProps)(CoachesApp);
