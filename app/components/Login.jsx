import React from 'react';
import {Grid, Row, Col, Button, FormControl, Image} from 'react-bootstrap';
var {connect} = require('react-redux');
var actions = require('actions');
import btn from 'styles.css'

class Login extends React.Component{
  onLogin(e) {
    e.preventDefault();
    var {dispatch} = this.props;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    dispatch(actions.startLogin(email, password));
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.onLogin(e);
    }
  }

  render() {
    return (
      <Grid style={{paddingTop:'40px'}}>
        <Row>
            <form onKeyPress={this.onKeyPress.bind(this)}>
              <Col xs={2} md={4} />
              <Col xs={8} md={4} >
                      <Image src="images/logo.png" height="80px" style={{paddingBottom:'10px', margin: '0 auto', display:'block'}} rounded />
                    <FormControl
                    style={{marginBottom: '10px'}}
                    id="email"
                    type="email"
                    placeholder="Email"
                    />
                    <FormControl
                    style={{marginBottom: '10px'}}
                    id="password"
                    type="password"
                    placeholder="Password"
                    />
                  <button className="btn" style={{width: '100%', margin: '0'}}
                       onClick={this.onLogin.bind(this)}>Login</button>
              </Col>
            <Col xs={2} md={4} />
            </form>
        </Row>
      </Grid>
  );
  }
}

export default connect()(Login);
