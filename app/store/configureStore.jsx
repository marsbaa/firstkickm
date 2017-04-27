import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction'
var {authReducer, usersReducer, centreReducer, navbarReducer, trialsReducer, selectionReducer, searchTextReducer, coachReducer, adminReducer, termReducer, ageGroupReducer, studentReducer, calendarReducer, coachScheduleReducer, paymentReducer, expenseReducer, registrationReducer, inventoryReducer, fetchingReducer} = require('reducers');

export var configure = (initialState = {}) => {
  var reducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    centres: centreReducer,
    navbar: navbarReducer,
    trials: trialsReducer,
    selection: selectionReducer,
    searchText: searchTextReducer,
    coaches: coachReducer,
    admins: adminReducer,
    terms: termReducer,
    ageGroup: ageGroupReducer,
    students: studentReducer,
    calendars: calendarReducer,
    coachSchedule: coachScheduleReducer,
    payments: paymentReducer,
    expenses: expenseReducer,
    register: registrationReducer,
    inventory: inventoryReducer,
    isFetching: fetchingReducer
  });
  var store = createStore(reducer, initialState, composeWithDevTools(
    applyMiddleware(thunk)
  ));

  return store;
};
