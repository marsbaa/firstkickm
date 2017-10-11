import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { startCoaches } from 'CoachesActions';
import { connect } from 'react-redux';

class CoachesApp extends React.Component {
  componentDidMount() {
    const { dispatch, coaches } = this.props;
    if (isEmpty(coaches)) {
      dispatch(startCoaches());
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
    coaches: state.coaches
  };
}

export default connect(mapStateToProps)(CoachesApp);
