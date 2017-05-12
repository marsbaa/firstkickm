import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

class AdminApp extends React.Component{
  componentDidMount() {
    var {dispatch, admins} = this.props;
    if (_.isEmpty(admins)) {
      dispatch(actions.startAdmins());
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

 export default connect((state) => {return state;
})(AdminApp);
