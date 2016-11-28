var redux = require('redux');
import thunk from 'redux-thunk';
var {authReducer, centreReducer, navbarReducer} = require('reducers');

export var configure = (initialState = {}) => {
  var reducer = redux.combineReducers({
    auth: authReducer,
    centres: centreReducer,
    navbar: navbarReducer
  });

  var store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
