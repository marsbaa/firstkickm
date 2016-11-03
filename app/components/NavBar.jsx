import React from 'react';
import {Navbar, NavItem, NavDropdown, MenuItem,Nav} from 'react-bootstrap';
import lnk from 'styles.css'

export var NavBar = React.createClass({

  getInitialState: function() {
    return {
      active: 1
    };
  },

  handleSelect: function(selectedKey) {
   this.setState({
     active: selectedKey
   });
 },

 render: function () {

  return (
    <Navbar collapseOnSelect style={{backgroundColor: '#ffffff',borderWidth: '5px', borderBottomColor: '#f5bd00'}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">
            <img src="images/logo.png" height="25px" />
          </a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight activeKey={this.state.active} onSelect={this.handleSelect}>
          <NavItem className="lnk" eventKey="1" href="#top">HOME</NavItem>
          <NavItem className="lnk" eventKey="2" href="#features">FEATURES</NavItem>
          <NavItem className="lnk" eventKey="3" href="#contact">CONTACT</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
});

export default (NavBar);
