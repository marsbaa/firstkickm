import React from 'react';
import _ from 'lodash';
import { startNotes } from 'actions';
import { connect } from 'react-redux';

class NotesApp extends React.Component {
  componentDidMount() {
    var { dispatch, notes } = this.props;
    if (_.isEmpty(notes)) {
      dispatch(startNotes());
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
    notes: state.notes
  };
}
export default connect(mapStateToProps)(NotesApp);
