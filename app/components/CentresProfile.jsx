import React from 'react';
import {Col, Button, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router'
import {header, button, btn, headerlnk} from 'styles.css';

var actions = require('actions');
var {connect} = require('react-redux');

export var CentresProfile = React.createClass({
  componentDidMount() {
    var {dispatch} = this.props;
    dispatch(actions.startCentres());
  },

  render: function () {

   return (
     <div style={{paddingTop: '20px'}}>
       {this.props.children}
     </div>

   );
 }
 });

 export default connect ()(CentresProfile);
