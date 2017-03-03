import React from 'react';
import {Navbar, Nav, NavItem,Image, Button} from 'react-bootstrap';
import body from 'styles.css'
var {connect} = require('react-redux');
var actions = require('actions');
import {Link} from 'react-router'

class NavBar extends React.Component {

  onLogout() {
    var {dispatch} = this.props;
   dispatch(actions.startLogout());
  }

 componentDidMount() {
   var {dispatch} = this.props;
   dispatch(actions.startAddTrials());
   dispatch(actions.startCentres());
   dispatch(actions.startCalendars());
 }

 render() {
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
          <Navbar.Toggle style={{marginTop: '15px'}}/>
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
}

export default connect((state) => {return state;
})(NavBar);
