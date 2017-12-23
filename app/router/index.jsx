import firebase from 'firebaseApp';
import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import Login from 'Login';

import DashboardApp from 'DashboardApp';
import NavBar from 'NavBar';
import MainMenu from 'MainMenu';
//Components for Access
import UserApp from 'UserApp';
import UserList from 'UserList';
import UserEdit from 'UserEdit';
//Components for Centre Profile
import CentresApp from 'CentresApp';
import CentreEdit from 'CentreEdit';
import CalendarEdit from 'CalendarEdit';
import ClassEdit from 'ClassEdit';

//Components for Trials
import TrialsApp from 'TrialsApp';
import TrialEditForm from 'TrialEditForm';
import TrialAddForm from 'TrialAddForm';
import TrialRegistration from 'TrialRegistration';
import TrialPayment from 'TrialPayment';

//Components for Openhouse
import OpenhouseEdit from 'OpenhouseEdit';
import OpenhouseRegister from 'OpenhouseRegister';
import OpenhousePayment from 'OpenhousePayment';
//JerseyIssue
import JerseyIssue from 'JerseyIssue';
import JerseyIssueList from 'JerseyIssueList';
import JerseyIssueForm from 'JerseyIssueForm';
import JerseyIssuedList from 'JerseyIssuedList';

import PaymentApp from 'PaymentApp';
import PaymentList from 'PaymentList';
import PaymentForm from 'PaymentForm';
import PaymentHistory from 'PaymentHistory';
import PaymentReport from 'PaymentReport';
import PaymentNotPaid from 'PaymentNotPaid';
import PaymentCheck from 'PaymentCheck';

//Components for Coaches
import CoachesApp from 'CoachesApp';
import CoachesList from 'CoachesList';
import CoachEdit from 'CoachEdit';
import CoachAttendance from 'CoachAttendance';
import CoachAttendanceHQ from 'CoachAttendanceHQ';

//Components for Admins
import AdminApp from 'AdminApp';
import AdminList from 'AdminList';
import AdminEdit from 'AdminEdit';
import AdminAdd from 'AdminAdd';

import Settings from 'Settings';
import SettingsList from 'SettingsList';
import EditAgeGroup from 'EditAgeGroup';

import ScheduleApp from 'ScheduleApp';
import ScheduleContainer from 'ScheduleContainer';
import ScheduleMain from 'ScheduleMain';

//Student Attendance
import AttendanceApp from 'AttendanceApp';
import AttendanceList from 'AttendanceList';
import AttendanceSummary from 'AttendanceSummary';
import AttendanceMakeUp from 'AttendanceMakeUp';
import AttendanceHistory from 'AttendanceHistory';

//Student Profile
import StudentApp from 'StudentApp';
import StudentList from 'StudentList';
import StudentEdit from 'StudentEdit';
import StudentAdd from 'StudentAdd';

//Total collection
import BankInCollection from 'BankInCollection';
import TotalCollection from 'TotalCollection';
import TotalCollectionHQ from 'TotalCollectionHQ';

//Inventory
import InventoryApp from 'InventoryApp';
import InventoryList from 'InventoryList';

//Notes
import NotesApp from 'NotesApp';
import NotesList from 'NotesList';
import NotesAll from 'NotesAll';

//Make Up
import MakeUpApp from 'MakeUpApp';
import MakeUpList from 'MakeUpList';

//Promotions
import PromotionsApp from 'PromotionsApp';
import PromotionAdd from 'PromotionAdd';

import CancelSessionApp from 'CancelSessionApp';

function requireAuth(nextState, replace, next) {
  if (!firebase.auth().currentUser) {
    replace('/');
  }
  next();
}

export default (
  <Router history={browserHistory}>
    <Route path="/">
      <IndexRoute component={Login} />
      <Route path="m" component={NavBar} onEnter={requireAuth}>
        <IndexRoute component={MainMenu} />
        <Route path="dashboard" component={DashboardApp} />
        <Route path="users" component={UserApp}>
          <IndexRoute component={UserList} />
          <Route path=":userId" component={UserEdit} />
        </Route>
        <Route path="bankin" component={BankInCollection} />
        <Route path="total" component={TotalCollection} />
        <Route path="totalhq" component={TotalCollectionHQ} />
        <Route path="centres" component={CentresApp} />
        <Route path="centres/:centreKey" component={CentreEdit} />
        <Route
          path="centres/:centreKey/:calendarKey"
          component={CalendarEdit}
        />
        <Route
          path="centres/:centreKey/class/:classKey"
          component={ClassEdit}
        />
        <Route path="cancel" component={CancelSessionApp} />
        <Route path="trials" component={TrialsApp} />
        <Route path="trials/edit/:trialId" component={TrialEditForm} />
        <Route path="trials/add" component={TrialAddForm} />
        <Route path="trials/register/:trialId" component={TrialRegistration} />
        <Route path="trials/payment" component={TrialPayment} />
        <Route path="coachattendance" component={CoachAttendance} />
        <Route path="coachattendanceHQ" component={CoachAttendanceHQ} />
        <Route path="attendance" component={AttendanceApp}>
          <IndexRoute component={AttendanceList} />
          <Route path="history/:studentId" component={AttendanceHistory} />
          <Route path="summary" component={AttendanceSummary} />
          <Route path="makeup/:studentId" component={AttendanceMakeUp} />
        </Route>
        <Route path="students" component={StudentApp} />
        <Route path="students/edit/:studentId" component={StudentEdit} />
        <Route path="students/add" component={StudentAdd} />
        <Route path="makeup" component={MakeUpApp}>
          <IndexRoute component={MakeUpList} />
        </Route>
        <Route path="payment" component={PaymentApp}>
          <IndexRoute component={PaymentList} />
          <Route path="report" component={PaymentReport} />
          <Route path="collection/:studentId" component={PaymentForm} />
          <Route path="history/:studentId" component={PaymentHistory} />
          <Route path="notpaid" component={PaymentNotPaid} />
        </Route>
        <Route path="coachschedule" component={ScheduleApp}>
          <IndexRoute component={ScheduleMain} />
          <Route
            path=":calendarKey/:term/:date"
            component={ScheduleContainer}
          />
        </Route>
        <Route path="coaches" component={CoachesApp}>
          <IndexRoute component={CoachesList} />
          <Route path=":coachId" component={CoachEdit} />
        </Route>
        <Route path="admins" component={AdminApp}>
          <IndexRoute component={AdminList} />
          <Route path="add" component={AdminAdd} />
          <Route path="edit/:adminId" component={AdminEdit} />
        </Route>
        <Route path="jersey" component={JerseyIssue}>
          <IndexRoute component={JerseyIssueList} />
          <Route path="issue/:paymentKey" component={JerseyIssueForm} />
          <Route path="issued" component={JerseyIssuedList} />
        </Route>
        <Route path="inventory" component={InventoryApp}>
          <IndexRoute component={InventoryList} />
        </Route>
        <Route path="notes" component={NotesApp}>
          <IndexRoute component={NotesList} />
          <Route path="all" component={NotesAll} />
        </Route>
        <Route path="settings" component={Settings}>
          <IndexRoute component={SettingsList} />
          <Route path="ageGroup/:name" component={EditAgeGroup} />
        </Route>
        <Route path="promotions" component={PromotionsApp} />
        <Route path="promotions/add" component={PromotionAdd} />
      </Route>
    </Route>
  </Router>
);
