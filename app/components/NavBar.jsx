import React from 'react';
import {Navbar, Nav, NavItem, FormGroup, FormControl} from 'react-bootstrap';
import select from 'styles.css'

export var NavBar = React.createClass({

  getInitialState: function() {
    return {

    };
  },

  handleSelect: function(selectedKey) {

 },

 render: function () {

  return (
    <Navbar style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: '0'}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">
            <img src="images/logo.png" height="40px" />
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    </Navbar>
  );
}
});

export default (NavBar);
