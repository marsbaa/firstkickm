import React from 'react';
import {Panel, Col, Button} from 'react-bootstrap';
import header from 'styles.css';

export var CentresProfile = React.createClass({
  render: function () {

   return (
     <div className="header">
       <Col xs={0} sm={1} md={1}/>
       <Col xs={8} sm={8} md={9}>
         <h4>Centres Profile</h4>
       </Col>
       <Col xs={4} sm={3} md={2} style={{textAlign: 'right'}}>
         <Button bsStyle="warning">+</Button>
       </Col>

      </div>
   );
 }
 });

 export default (CentresProfile);
