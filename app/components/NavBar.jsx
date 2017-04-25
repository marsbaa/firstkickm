import React from 'react';
import {Navbar, Nav, NavItem,Image, Button, Grid, Row, Col} from 'react-bootstrap';
import body from 'styles.css'
var {connect} = require('react-redux');
var actions = require('actions');
import {Link, browserHistory} from 'react-router'
import Loading from 'react-loading'

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading : true
    }
  }

  onLogout() {
    var {dispatch} = this.props;
   dispatch(actions.startLogout());
  }

 componentWillMount() {
   var {dispatch} = this.props;
   dispatch(actions.startAddTrials());
   dispatch(actions.startCalendars());
   dispatch(actions.startAgeGroup());
   dispatch(actions.startStudents());
   dispatch(actions.startUsers());
   dispatch(actions.startCentres());
   //dispatch(actions.updateCoachDate());
 }

 render() {
   var {users, auth, navbar, dispatch, isFetching} = this.props;
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

   var loadingHTML = []
  loadingHTML.push(
    <Grid key='loading' style={{paddingTop:'20px', overflow: 'hidden'}}>
      <Row>
        <Col xs={5} md={5} lg={5}></Col>
        <Col xs={2} md={2} lg={2}>
          <div style={{margin: 'auto'}}>
            <Loading type='cylon' color='#000000' />
            </div>
          </Col>
        <Col xs={5} md={5} lg={5}></Col>
      </Row>
    </Grid>
  )

  return (
    <div>
      <Navbar style={{backgroundColor: '#ffffff', padding: '10px', marginBottom: '0'}}>
        <Navbar.Header>
          <Navbar.Brand style={{fontSize: '16px'}}>
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
        {isFetching.completed? this.props.children: loadingHTML}
      </div>
    </div>

  );
}
}

export default connect((state) => {return state;
})(NavBar);
