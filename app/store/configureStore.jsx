var redux = require('redux');
import thunk from 'redux-thunk';
var {authReducer, centreReducer, navbarReducer, trialsReducer, selectionReducer, searchTextReducer, coachReducer, termReducer, ageGroupReducer, studentReducer} = require('reducers');

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({
    auth: authReducer,
    centres: centreReducer,
    navbar: navbarReducer,
    trials: trialsReducer,
    selection: selectionReducer,
    searchText: searchTextReducer,
    coaches: coachReducer,
    terms: termReducer,
    ageGroup: ageGroupReducer,
    students: studentReducer
  });

  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
