import firebase from 'app/firebase/';
import React from 'react';
import {Route, Router, IndexRoute, browserHistory} from 'react-router';

import NavBar from 'NavBar';
import Login from 'Login';
import CentresApp from 'CentresApp';
import MainMenu from 'MainMenu';
import EditCentreProfile from 'EditCentreProfile'
import CentresList from 'CentresList'
import TrialsApp from 'TrialsApp'
import TrialList from 'TrialList'
import TrialEdit from 'TrialEdit'
import CoachesApp from 'CoachesApp'
import CoachesList from 'CoachesList'
import EditCoach from 'EditCoach'


var redirectIfLoggedIn = (nextState, replace, next) => {
  if (firebase.auth().currentUser) {
    replace('/m');
  }
  next();
};

function requireAuth(nextState, replace, next) {
  if (!firebase.auth().currentUser) {
    replace('/');
  }
  next();
};

export default (
  <Router history={browserHistory}>
    <Route path="/">
        <IndexRoute component={Login} />
        <Route path="m" component={NavBar} onEnter={requireAuth}>
          <IndexRoute component={MainMenu}/>
          <Route path="centres" component={CentresApp}>
            <IndexRoute component={CentresList}/>
            <Route path=":centreID" component={EditCentreProfile} />
          </Route>
          <Route path="trials/:selectedCentreId" component={TrialsApp}>
            <IndexRoute component={TrialList}/>
            <Route path=":key" component={TrialEdit} />
          </Route>
          <Route path="coaches" component={CoachesApp}>
            <IndexRoute component={CoachesList}/>
            <Route path=":coachId" component={EditCoach} />
          </Route>
        </Route>
    </Route>
  </Router>
);
