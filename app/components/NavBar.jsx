import React from 'react';
import {Navbar, Nav, NavItem,Image, Button} from 'react-bootstrap';
import body from 'styles.css'
var {connect} = require('react-redux');
var actions = require('actions');
import {Link} from 'react-router'

export var NavBar = React.createClass({
  onLogout() {
  var {dispatch} = this.props;
  dispatch(actions.startLogout());
 },

 render: function () {
   var {navbar} = this.props;
  return (
    <div>
      <Navbar style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: '0'}}>
        <Navbar.Header>
          <Navbar.Brand>
             <Link to="/m">
              <Image src="/images/logo.png" height="40px" rounded />
             </Link>
             <Link className="headerlnk" to={navbar.link}>{navbar.title}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
         <Nav pullRight>
           <NavItem>
             <butt onClick={this.onLogout}>
               Log Out
             </butt>
           </NavItem>
         </Nav>
         </Navbar.Collapse>
      </Navbar>
      <div className="body">
        {this.props.children}
      </div>
    </div>

  );
}
});

export default connect((state) => {return state;
})(NavBar);
