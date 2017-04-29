import firebase from 'app/firebase/';
import React from 'react';
import {Route, Router, IndexRoute, browserHistory} from 'react-router';

import NavBar from 'NavBar';
import Login from 'Login';
import MainMenu from 'MainMenu';
//Components for Access
import UserApp from 'UserApp'
import UserList from 'UserList'
import UserEdit from 'UserEdit'
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
import TrialPaymentForm from 'TrialPaymentForm'

//JerseyIssue
import JerseyIssue from 'JerseyIssue'
import JerseyIssueList from 'JerseyIssueList'
import JerseyIssueForm from 'JerseyIssueForm'
import JerseyIssuedList from 'JerseyIssuedList'

import PaymentApp from 'PaymentApp'
import PaymentList from 'PaymentList'
import PaymentForm from 'PaymentForm'
import PaymentHistory from 'PaymentHistory'

//Components for Coaches
import CoachesApp from 'CoachesApp'
import CoachesList from 'CoachesList'
import CoachEdit from 'CoachEdit'
import CoachAttendance from 'CoachAttendance'
import CoachAttendanceHQ from 'CoachAttendanceHQ'

//Components for Admins
import AdminApp from 'AdminApp'
import AdminList from 'AdminList'
import AdminEdit from 'AdminEdit'

import Settings from 'Settings'
import SettingsList from 'SettingsList'
import EditAgeGroup from 'EditAgeGroup'

import ScheduleApp from 'ScheduleApp'
import ScheduleContainer from 'ScheduleContainer'
import ScheduleMain from 'ScheduleMain'

//Student Attendance
import AttendanceApp from 'AttendanceApp'
import AttendanceList from 'AttendanceList'
import AttendanceEdit from 'AttendeeEdit'

//Student Profile
import StudentApp from 'StudentApp'
import StudentList from 'StudentList'
import StudentEdit from 'StudentEdit'
import StudentAdd from 'StudentAdd'

//Total collection
import TotalCollection from 'TotalCollection'
import TotalCollectionHQ from 'TotalCollectionHQ'

//Inventory
import InventoryApp from 'InventoryApp'
import InventoryList from 'InventoryList'

//Charts
import ChartsApp from 'ChartsApp'
import ChartsList from 'ChartsList'

//Notes
import NotesApp from 'NotesApp'
import NotesList from 'NotesList'

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
          <Route path="users" component={UserApp}>
            <IndexRoute component={UserList}/>
            <Route path=":userId" component={UserEdit} />
          </Route>
          <Route path="total" component={TotalCollection}/>
          <Route path="totalhq" component={TotalCollectionHQ}/>
          <Route path="centres" component={CentresApp}>
            <IndexRoute component={CentresList}/>
            <Route path=":centreID" component={CentreEdit}/>
            <Route path=":centreID/:calendarKey" component={TermEdit} />
            <Route path=":centreID/class/:classKey" component={ClassEdit} />
          </Route>
          <Route path="trials" component={TrialsApp}>
            <IndexRoute component={TrialList}/>
            <Route path="edit/:trialId" component={TrialEdit} />
            <Route path="add" component={TrialAdd} />
            <Route path="register/:trialId" component={TrialRegister} />
            <Route path="payment" component={TrialPaymentForm} />
          </Route>
          <Route path="coachattendance" component={CoachAttendance} />
          <Route path="coachattendanceHQ" component={CoachAttendanceHQ} />
          <Route path="attendance" component={AttendanceApp}>
            <IndexRoute component={AttendanceList}/>
            <Route path="edit/:studentId" component={AttendanceEdit} />
          </Route>
          <Route path="students" component={StudentApp}>
            <IndexRoute component={StudentList}/>
            <Route path="edit/:studentId" component={StudentEdit} />
            <Route path="add" component={StudentAdd} />
          </Route>
          <Route path="payment" component={PaymentApp}>
            <IndexRoute component={PaymentList}/>
            <Route path="collection/:studentId" component={PaymentForm}/>
            <Route path="history/:studentId" component={PaymentHistory}/>
          </Route>
          <Route path="coachschedule" component={ScheduleApp}>
            <IndexRoute component={ScheduleMain} />
            <Route path=":calendarKey/:date" component={ScheduleContainer} />
          </Route>
          <Route path="coaches" component={CoachesApp}>
            <IndexRoute component={CoachesList}/>
            <Route path=":coachId" component={CoachEdit} />
          </Route>
          <Route path="admins" component={AdminApp}>
            <IndexRoute component={AdminList}/>
            <Route path=":adminId" component={AdminEdit} />
          </Route>
          <Route path="jersey" component={JerseyIssue}>
            <IndexRoute component={JerseyIssueList} />
            <Route path="issue/:paymentKey" component={JerseyIssueForm} />
            <Route path="issued" component={JerseyIssuedList} />
          </Route>
          <Route path="inventory" component={InventoryApp}>
            <IndexRoute component={InventoryList} />
          </Route>
          <Route path="charts" component={ChartsApp}>
            <IndexRoute component={ChartsList}/>
          </Route>
          <Route path="notes" component={NotesApp}>
            <IndexRoute component={NotesList}/>
          </Route>
          <Route path="settings" component={Settings}>
            <IndexRoute component={SettingsList}/>
              <Route path="ageGroup/:name" component={EditAgeGroup} />
          </Route>
        </Route>
    </Route>
  </Router>
);
