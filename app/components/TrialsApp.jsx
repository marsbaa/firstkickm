import React from 'react';
var actions = require('actions');
var {connect} = require('react-redux');

export var TrialsApp = React.createClass({

  render: function () {

   return (
     <div>
       {this.props.children}
     </div>

   );
 }
 });

 export default connect ()(TrialsApp);