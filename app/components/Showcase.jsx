import React from 'react';
import {Jumbotron, Button, Col} from 'react-bootstrap';

export var Showcase = React.createClass({
  render: function() {
    return (
      <Jumbotron style={{backgroundColor: 'white', paddingBottom: '0', marginBottom: '0'}}>
          <Col xs={3} md={3} />
          <Col xs={6} md={6}>
              <p style={{textAlign: 'center'}}>Beetot is a platform which helps you <b>market</b>, <b>manage</b> and <b>attract the right customers</b> to your business.</p>
          </Col>
          <Col xs={3} md={3} />
          <img src="images/map.png" width="100%"/>
      </Jumbotron>
    )
  }
});

export default (Showcase);
