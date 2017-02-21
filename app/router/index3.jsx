import firebase from 'app/firebase/';
import React from 'react';
import {Route, Router, IndexRoute, browserHistory, IndexRedirect} from 'react-router';

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
import Settings from 'Settings'
import SettingsList from 'SettingsList'
import EditAgeGroup from 'EditAgeGroup'
import EditTerm from 'EditTerm'
import EditClass from 'EditClass'
import ScheduleApp from 'ScheduleApp'
import Schedule from 'Schedule'
import ScheduleMain from 'ScheduleMain'
import AttendanceApp from 'AttendanceApp'
import AttendanceList from 'AttendanceList'

import AuthService from 'AuthService'

const auth = new AuthService('O6sBBbl1RwKg77FA76knLBC6wfTcrW8L', 'fka.auth0.com');

// validate authentication for private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}


export default (
  <Router history={browserHistory}>
    <Route path="/" auth={auth}>
       <IndexRedirect to="/m" />
        <Route path="login" component={Login} />
        <Route path="m" component={NavBar} onEnter={requireAuth}>
          <IndexRoute component={MainMenu}/>
          <Route path="centres" component={CentresApp}>
            <IndexRoute component={CentresList}/>
            <Route path=":centreID" component={EditCentreProfile}/>
            <Route path=":centreID/:calendarKey" component={EditTerm} />
            <Route path=":centreID/class/:classKey" component={EditClass} />
          </Route>
          <Route path="trials" component={TrialsApp}>
            <IndexRoute component={TrialList}/>
            <Route path=":studentId" component={TrialEdit} />
          </Route>
          <Route path="attendance" component={AttendanceApp}>
            <IndexRoute component={AttendanceList}/>
          </Route>
          <Route path="coachschedule" component={ScheduleApp}>
            <IndexRoute component={ScheduleMain} />
            <Route path=":calendarKey" component={Schedule} />
          </Route>
          <Route path="coaches" component={CoachesApp}>
            <IndexRoute component={CoachesList}/>
            <Route path=":coachId" component={EditCoach} />
          </Route>
          <Route path="settings" component={Settings}>
            <IndexRoute component={SettingsList}/>
              <Route path="ageGroup/:name" component={EditAgeGroup} />
          </Route>
        </Route>
    </Route>
  </Router>
);
