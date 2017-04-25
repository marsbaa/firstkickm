import React from 'react';
var actions = require('actions');
var {connect} = require('react-redux');

class TrialsApp extends React.Component {

  render() {

   return (
     <div>
       {this.props.children}
     </div>

   );
 }
 }

 export default connect ()(TrialsApp);
