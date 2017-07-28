import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import reduxReset from 'redux-reset';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import {
  authReducer,
  usersReducer,
  centreReducer,
  navbarReducer,
  trialsReducer,
  openhouseReducer,
  selectionReducer,
  selectedPromotionReducer,
  searchTextReducer,
  coachReducer,
  adminReducer,
  termReducer,
  ageGroupReducer,
  studentReducer,
  calendarReducer,
  coachScheduleReducer,
  paymentReducer,
  expenseReducer,
  registrationReducer,
  inventoryReducer,
  fetchingReducer,
  notesReducer,
  makeUpReducer,
  redirectReducer,
  parentReducer,
  promotionsReducer
} from 'reducers';

export var configure = (initialState = {}) => {
  var reducer = combineReducers({
    auth: authReducer,
    users: usersReducer,
    centres: centreReducer,
    navbar: navbarReducer,
    trials: trialsReducer,
    openhouse: openhouseReducer,
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
    parent: parentReducer,
    inventory: inventoryReducer,
    isFetching: fetchingReducer,
    notes: notesReducer,
    makeUps: makeUpReducer,
    redirect: redirectReducer,
    form: formReducer,
    promotions: promotionsReducer,
    selectedPromotion: selectedPromotionReducer
  });

  const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk), reduxReset())
  );

  return store;
};
