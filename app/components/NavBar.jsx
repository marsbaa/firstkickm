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
    <Navbar style={{backgroundColor: '#ffffff',borderWidth: '5px', borderBottomColor: '#f5bd00', padding: '15px'}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">
            <img src="images/logo.png" height="40px" />
          </a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
        <NavItem>
          <select id="selectCentre" className="select">
            <option value="bishan">Bishan</option>
            <option value="bishan">Punggol</option>
            <option value="bishan">Kovan</option>
          </select>
        </NavItem>
      </Nav>
    </Navbar>
  );
}
});

export default (NavBar);
