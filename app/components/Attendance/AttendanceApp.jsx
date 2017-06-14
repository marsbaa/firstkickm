import React from 'react';

class AttendanceApp extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default AttendanceApp;
