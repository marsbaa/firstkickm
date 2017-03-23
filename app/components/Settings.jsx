import React from 'react';
var actions = require('actions');
var {connect} = require('react-redux');

export var Settings = React.createClass({
  componentDidMount() {
    var {dispatch, ageGroup} = this.props;
    if (_.isEmpty(ageGroup)) {
      dispatch(actions.startAgeGroup());
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
})(Settings);
