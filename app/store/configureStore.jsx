import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction'
var {authReducer, usersReducer, centreReducer, navbarReducer, trialsReducer, selectionReducer, searchTextReducer, coachReducer, termReducer, ageGroupReducer, studentReducer, calendarReducer, coachScheduleReducer, paymentReducer} = require('reducers');

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
    terms: termReducer,
    ageGroup: ageGroupReducer,
    students: studentReducer,
    calendars: calendarReducer,
    coachSchedule: coachScheduleReducer,
    payments: paymentReducer
  });
  var store = createStore(reducer, initialState, composeWithDevTools(
    applyMiddleware(thunk)
  ));

  return store;
};
