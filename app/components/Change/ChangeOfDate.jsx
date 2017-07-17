import React from 'react';
import { connect } from 'react-redux';

class ChangeOfDate extends React.Component {
  render() {
    return (
      <div>
        Hello
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ChangeOfDate);
