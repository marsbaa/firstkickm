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

import PaymentApp from 'PaymentApp'
import PaymentList from 'PaymentList'
import PaymentForm from 'PaymentForm'

//Components for Coaches
import CoachesApp from 'CoachesApp'
import CoachesList from 'CoachesList'
import CoachEdit from 'CoachEdit'

import Settings from 'Settings'
import SettingsList from 'SettingsList'
import EditAgeGroup from 'EditAgeGroup'

import ScheduleApp from 'ScheduleApp'
import ScheduleContainer from 'ScheduleContainer'
import ScheduleMain from 'ScheduleMain'

//Student Attendance
import AttendanceApp from 'AttendanceApp'
import AttendanceList from 'AttendanceList'

//Student Profile
import StudentApp from 'StudentApp'
import StudentList from 'StudentList'
import StudentEdit from 'StudentEdit'
import StudentAdd from 'StudentAdd'


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
          <Route path="students" component={StudentApp}>
            <IndexRoute component={StudentList}/>
            <Route path="edit/:studentId" component={StudentEdit} />
            <Route path="add" component={StudentAdd} />
          </Route>
          <Route path="payment" component={PaymentApp}>
            <IndexRoute component={PaymentList}/>
            <Route path="collection/:studentId" component={PaymentForm}/>
          </Route>
          <Route path="coachschedule" component={ScheduleApp}>
            <IndexRoute component={ScheduleMain} />
            <Route path=":calendarKey/:date" component={ScheduleContainer} />
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
