import React from 'react';
import _ from 'lodash';
import { startStudents } from 'actions';
import { connect } from 'react-redux';

class AttendanceApp extends React.Component {
  componentWillMount() {
    let { dispatch, students } = this.props;
    if (_.isEmpty(students)) {
      dispatch(startStudents());
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
    students: state.students
  };
}

export default connect(mapStateToProps)(AttendanceApp);
