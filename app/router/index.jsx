import firebase from 'app/firebase/';
import React from 'react';
import {Route, Router, IndexRoute, browserHistory} from 'react-router';

import NavBar from 'NavBar';
import Login from 'Login';
import CentresProfile from 'CentresProfile';
import MainMenu from 'MainMenu';
import EditCentreProfile from 'EditCentreProfile'
import CentresTable from 'CentresTable'

var requireLogin = (nextState, replace, next) => {
  if (!firebase.auth().currentUser) {
    replace('/');
  }
  next();
};

var redirectIfLoggedIn = (nextState, replace, next) => {
  if (firebase.auth().currentUser) {
    replace('/m');
  }
  next();
};

export default (
  <Router history={browserHistory}>
    <Route path="/">
        <IndexRoute component={Login} onEnter={redirectIfLoggedIn}/>
        <Route path="m" component={NavBar} onEnter={requireLogin}>
          <IndexRoute component={MainMenu}/>
          <Route path="cp" component={CentresProfile}>
            <IndexRoute component={CentresTable}/>
            <Route path=":centreID" component={EditCentreProfile} />
          </Route>
        </Route>
    </Route>
  </Router>
);
