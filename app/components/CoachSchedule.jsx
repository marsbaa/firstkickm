import React from 'react';
var actions = require('actions');
var {connect} = require('react-redux');


export var CoachSchedule = React.createClass({
  componentWillMount () {
    var {dispatch, coaches} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
    }
  },


  render: function () {

   return (
     <div style={{paddingTop: '20px'}}>
       {this.props.children}
     </div>

   );
 }
 });

 export default connect ()(CoachSchedule);
