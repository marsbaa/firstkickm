import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
import firebase from 'app/firebase/';
import router from 'app/router';
var {Provider} = require('react-redux');
var actions = require('actions');


var store = require('configureStore').configure();


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(actions.login(user.uid, user.email));
    browserHistory.push('/m');
  }
  else {
    store.dispatch(actions.logout());
    browserHistory.push('/');
  }

});

ReactDOM.render(
  <Provider store={store}>
    {router}
  </Provider>,
  document.getElementById('app')
);
