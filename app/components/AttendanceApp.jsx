import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

export var AttendanceApp = React.createClass({
  componentDidMount() {
    var {dispatch, students} = this.props;
    if (_.isEmpty(students)) {
      dispatch(actions.startStudents());
    }
  },

  render: function () {

   return (
     <div>
       {this.props.children}
     </div>

   );
 }
 });

 export default connect((state) => {return state;
})(AttendanceApp);
