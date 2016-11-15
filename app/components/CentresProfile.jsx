import React from 'react';
import {Panel, Col, Button} from 'react-bootstrap';
import header from 'styles.css';

export var CentresProfile = React.createClass({
  render: function () {

   return (
     <div className="header">
       <Col xs={8} md={9}>
         <h4>Centres Profile</h4>
       </Col>
       <Col xs={4} md={2} style={{textAlign: 'right'}}>
         <Button bsStyle="warning">+</Button>
       </Col>

      </div>
   );
 }
 });

 export default (CentresProfile);
