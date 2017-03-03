import firebase from 'app/firebase/';
import React from 'react';
import {Route, Router, IndexRoute, browserHistory} from 'react-router';

import NavBar from 'NavBar';
import Login from 'Login';
import MainMenu from 'MainMenu';
//Components for Centre Profile
import CentresApp from 'CentresApp';
import CentreEdit from 'CentreEdit'
import CentresList from 'CentresList'
import TermEdit from 'TermEdit'
import ClassEdit from 'ClassEdit'
//Components for Trials
import TrialsApp from 'TrialsApp'
import TrialList from 'TrialList'
import TrialEdit from 'TrialEdit'
import TrialAdd from 'TrialAdd'
import TrialRegister from 'TrialRegister'
//import Payment from 'Payment'

//Components for Coaches
import CoachesApp from 'CoachesApp'
import CoachesList from 'CoachesList'
import CoachEdit from 'CoachEdit'

import Settings from 'Settings'
import SettingsList from 'SettingsList'
import EditAgeGroup from 'EditAgeGroup'

import ScheduleApp from 'ScheduleApp'
import ScheduleList from 'ScheduleList'
import ScheduleMain from 'ScheduleMain'
import AttendanceApp from 'AttendanceApp'
import AttendanceList from 'AttendanceList'


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
            <Route path=":centreID" component={CentreEdit}/>
            <Route path=":centreID/:calendarKey" component={TermEdit} />
            <Route path=":centreID/class/:classKey" component={ClassEdit} />
          </Route>
          <Route path="trials" component={TrialsApp}>
            <IndexRoute component={TrialList}/>
            <Route path="edit/:studentId" component={TrialEdit} />
            <Route path="add" component={TrialAdd} />
            <Route path="register/:studentId" component={TrialRegister} />
          </Route>
          <Route path="attendance" component={AttendanceApp}>
            <IndexRoute component={AttendanceList}/>
          </Route>
          <Route path="coachschedule" component={ScheduleApp}>
            <IndexRoute component={ScheduleMain} />
            <Route path=":calendarKey/:date" component={ScheduleList} />
          </Route>
          <Route path="coaches" component={CoachesApp}>
            <IndexRoute component={CoachesList}/>
            <Route path=":coachId" component={CoachEdit} />
          </Route>
          <Route path="settings" component={Settings}>
            <IndexRoute component={SettingsList}/>
              <Route path="ageGroup/:name" component={EditAgeGroup} />
          </Route>
        </Route>
    </Route>
  </Router>
);
