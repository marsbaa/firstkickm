import React from 'react';
var actions = require('actions');
var {connect} = require('react-redux');

class MakeUpApp extends React.Component {
  componentDidMount(){
    var {dispatch, makeUps} = this.props
    if(_.isEmpty(makeUps)){
      dispatch(actions.startMakeUps())
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

 export default connect ((state) => {return state;
})(MakeUpApp);
