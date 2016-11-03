import React from 'react';
import {Jumbotron} from 'react-bootstrap';

export var Footer = React.createClass({
  render: function() {
    return (
    <Jumbotron style={{paddingTop: '20px', backgroundColor: '#f5bb05', marginBottom: '0'}}>
      <div className="container" style={{textAlign: 'center', height: '40px'}}>
        Copyright © 2016 Beetot Pte Ltd. All Rights Reserved.
      </div>
    </Jumbotron>

  )
  }
});

export default (Footer);
