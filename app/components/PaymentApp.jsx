import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

class PaymentApp extends React.Component {
  componentDidMount() {
    var {dispatch, students} = this.props;
    if (_.isEmpty(students)) {
      dispatch(actions.startStudents());
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
})(PaymentApp);
