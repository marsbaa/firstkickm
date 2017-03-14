var React = require('react');
var ReactDOM = require('react-dom');
var {browserHistory} = require('react-router');
var store = require('configureStore').configure();
import NavBar from 'NavBar';
import Login from 'Login';
import router from 'app/router';
var {Provider} = require('react-redux');
var actions = require('actions');

import firebase from 'app/firebase/';


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(actions.login(user.uid));
    browserHistory.push('/m');
  }
  else {
    store.dispatch(actions.logout());
    browserHistory.push('/');
  }

});

store.dispatch(actions.startCentres());

ReactDOM.render(
  <Provider store={store}>
    {router}
  </Provider>,
  document.getElementById('app')
);
