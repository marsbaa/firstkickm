import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

export var CoachesApp = React.createClass({
  componentDidMount() {
    var {dispatch, coaches} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
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
})(CoachesApp);
