import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

class UserApp1 extends React.Component {
  componentDidMount() {
    var {dispatch, users} = this.props;
    if (_.isEmpty(users)) {
      dispatch(actions.startUsers());
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
})(UserApp1);
