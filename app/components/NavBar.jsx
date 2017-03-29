import React from 'react';
import {Navbar, Nav, NavItem,Image, Button} from 'react-bootstrap';
import body from 'styles.css'
var {connect} = require('react-redux');
var actions = require('actions');
import {Link, browserHistory} from 'react-router'

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
   dispatch(actions.startAgeGroup());
   dispatch(actions.startStudents());
   dispatch(actions.startUsers());
 }

 render() {
   var {users, auth, navbar} = this.props;
   var user;
   if (auth.email === 'ray@marsbaa.com') {
     user = {
       name: 'Ray Yee',
       email: 'ray@marsbaa.com',
       assignedRoles : 'Manager',
       assignedCentres : { 0 : 'all'}
     }
   }
   else {
     user = _.find(users, ['email', auth.email])
   }
   var html=[]
   if (user !== undefined) {
     if (user.assignedRoles.indexOf('Manager') > -1) {
       html.push(
           <NavItem key="centres" eventKey={1}>
           <butt onClick={(e)=> {
                e.preventDefault()
                 browserHistory.push("/m/centres")}}>Centres Profile</butt>
             </NavItem>)
      html.push(
        <NavItem key="settings" eventKey={2}>
        <butt onClick={(e)=> {
             e.preventDefault()
              browserHistory.push("/m/settings")}}>Settings</butt>
      </NavItem>
      )
      html.push(
        <NavItem key="users" eventKey={3}>
       <butt onClick={(e)=> {
            e.preventDefault()
             browserHistory.push("/m/users")}}>Access Rights</butt>
      </NavItem>
      )
     }
   }

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
           {html}
           <NavItem eventKey={4}>
             <butt onClick={this.onLogout.bind(this)}>
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
