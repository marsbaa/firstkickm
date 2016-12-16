import React from 'react';
var actions = require('actions');
var {connect} = require('react-redux');

export var CentresProfile = React.createClass({

  render: function () {

   return (
     <div style={{paddingTop: '20px'}}>
       {this.props.children}
     </div>

   );
 }
 });

 export default connect ()(CentresProfile);
