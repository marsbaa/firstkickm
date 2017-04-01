import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

class JerseyIssue extends React.Component {
  componentDidMount() {
    var {dispatch, payments} = this.props;
    if (_.isEmpty(payments)) {
      dispatch(actions.startPayments());
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
})(JerseyIssue);
