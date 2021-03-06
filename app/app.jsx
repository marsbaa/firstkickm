import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import firebase from 'firebaseApp';
import router from 'router';
import { Provider } from 'react-redux';
import { login, logout } from 'AuthActions';
import { ThemeProvider } from 'styled-components';
const store = require('configureStore').configure();

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch(login(user.uid, user.email));
    browserHistory.push('/m');
  } else {
    store.dispatch(logout());
    browserHistory.push('/');
  }
});

const theme = {
  primary: '#f5bb05',
  secondary: '#656565',
  secondaryFont: '#ffffff'
};

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {router}
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
);
