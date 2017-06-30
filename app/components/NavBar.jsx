import React from 'react';
import { Navbar, Nav, NavItem, Image, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { isManager } from 'helper';
import {
  startLogout,
  startUsers,
  startCentres,
  startCalendars,
  startAgeGroup,
  startStudents,
  startMakeUps
} from 'actions';
import { Link, browserHistory } from 'react-router';
import styled from 'styled-components';
import Loading from 'Loading';

const Button = styled.button`
  border-radius: 3px;
  border: 1px solid ${props => props.theme.primary};
  background : none;
  color: ${props => props.theme.primary};
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.secondary};
  margin-top: 20px;
`;

const StyledHeaderLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.primary};
  border-bottom: 1px dashed;
  padding-top: 5px;
  fontWeight: 500;
  margin-left: 20px;
`;

class NavBar extends React.Component {
  onLogout() {
    var { dispatch } = this.props;
    dispatch(startLogout());
    browserHistory.push('/');
  }

  componentWillMount() {
    var { dispatch } = this.props;
    dispatch(startUsers());
    dispatch(startCentres());
    dispatch(startCalendars());
    dispatch(startStudents());
    dispatch(startAgeGroup());
    dispatch(startMakeUps());
  }

  render() {
    const { navbar, auth, users, isFetching } = this.props;
    return (
      <div>
        <Navbar style={{ padding: '10px', marginBottom: '0px' }}>
          <Navbar.Header>
            <Navbar.Brand style={{ fontSize: '16px' }}>
              <StyledLink to="/m">
                <Image src="/images/logo.png" height="40px" rounded />
              </StyledLink>
              <StyledHeaderLink to={navbar.link}>
                {navbar.title}
              </StyledHeaderLink>
            </Navbar.Brand>
            <Navbar.Toggle style={{ marginTop: '15px' }} />
          </Navbar.Header>
          <Navbar.Collapse>

            {isManager(auth, users)
              ? <Nav style={{ float: 'right' }}>
                  <NavItem key="centres" eventKey={1}>
                    <butt
                      onClick={e => {
                        e.preventDefault();
                        browserHistory.push('/m/centres');
                      }}
                    >
                      Centres Profile
                    </butt>
                  </NavItem>
                  <NavItem key="settings" eventKey={2}>
                    <butt
                      onClick={e => {
                        e.preventDefault();
                        browserHistory.push('/m/settings');
                      }}
                    >
                      Settings
                    </butt>
                  </NavItem>
                  <NavItem key="users" eventKey={3}>
                    <butt
                      onClick={e => {
                        e.preventDefault();
                        browserHistory.push('/m/users');
                      }}
                    >
                      Access Rights
                    </butt>
                  </NavItem>
                  <NavItem eventKey={4}>
                    <Button onClick={this.onLogout.bind(this)}>
                      Log Out
                    </Button>
                  </NavItem>
                </Nav>
              : <Nav style={{ float: 'right' }}>
                  <NavItem eventKey={1}>
                    <Button onClick={this.onLogout.bind(this)}>
                      Log Out
                    </Button>
                  </NavItem>
                </Nav>}

          </Navbar.Collapse>
        </Navbar>
        {isFetching.completed
          ? <div style={{ padding: '0px 8px' }}>
              {this.props.children}
            </div>
          : <Loading />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navbar: state.navbar,
    auth: state.auth,
    users: state.users,
    isFetching: state.isFetching
  };
}

export default connect(mapStateToProps)(NavBar);
