import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

class CoachesApp extends React.Component{
  componentDidMount() {
    var {dispatch, coaches} = this.props;
    if (_.isEmpty(coaches)) {
      dispatch(actions.startCoaches());
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
})(CoachesApp);
