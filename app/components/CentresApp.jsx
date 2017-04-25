import React from 'react';
var actions = require('actions');
var {connect} = require('react-redux');

class CentresProfile extends React.Component{

  render() {

   return (
     <div>
       {this.props.children}
     </div>

   );
 }
 }

 export default connect ()(CentresProfile);
