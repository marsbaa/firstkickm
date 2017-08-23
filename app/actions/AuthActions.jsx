import firebase from 'firebaseApp';

//Login & Logout Actions

export const startLogin = (email, password) => {
  return (dispatch, getState) => {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(
      result => {
        console.log('Auth worked!');
      },
      error => {
        console.log('Unable to auth', error);
      }
    );
  };
};

export const startLogout = () => {
  return (dispatch, getState) => {
    return firebase.auth().signOut().then(
      function() {
        // Sign-out successful.
        console.log('Logged out!');
        dispatch(resetState());
      },
      function(error) {
        // An error happened.
      }
    );
  };
};

export const resetState = () => ({
  type: 'RESET'
});

export var login = (uid, email) => ({
  type: 'LOGIN',
  uid,
  email
});

export var logout = () => ({
  type: 'LOGOUT'
});
