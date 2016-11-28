import firebase, {firebaseRef} from 'app/firebase';

//Login & Logout Actions

export var startLogin = (email, password) => {
  return (dispatch, getState) => {
    return firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
      console.log('Auth worked!', result);
    }, (error) => {
      console.log('Unable to auth', error);
    });
  };
};

export var startLogout = () => {
  return (dispatch, getState) => {
    return firebase.auth().signOut().then(function() {
  // Sign-out successful.
      console.log('Logged out!');
}, function(error) {
  // An error happened.
});
  };
};

export var login = (uid) => {
  return{
    type: 'LOGIN',
    uid
  };
};

export var logout = () => {
  return {
    type: 'LOGOUT'
  };
};

//Navbar
export var updateNavTitle = (link, title) => {
  return {
    type: 'UPDATE_NAV_TITLE',
    link,
    title
  };
};


//Centre Profile
export var startCentres = () => {
   return (dispatch) => {
   var centreRef = firebaseRef.child('centres');
   centreRef.once('value').then((snapshot) => {
    var centres = snapshot.val();
    var parsedCentres = [];

    Object.keys(centres).forEach((centreId)=> {
      parsedCentres.push({
        id: centreId,
        ...centres[centreId]
      });
    });
    dispatch(addCentres(parsedCentres));
  });
};
};

export var addCentres = (centres) => {
  return {
    type: 'ADD_CENTRES',
    centres
  };
};

export var addCentre = (centre) => {
  var centreRef = firebaseRef.child('centres');
  var newKey = centreRef.push().key;
  var updates = {};
  updates[newKey] = centre;
  centreRef.update(updates);
  centre.key = newKey;
  return {
    type: 'ADD_CENTRE',
    centre
  };
};

export var updateCentre = (centre) => {
  var centreRef = firebaseRef.child('centres');
  centreRef.push().set({
    id : centre.id,
    name : centre.name
  });
  return {
    type: 'ADD_CENTRE',
    centre
  };
};
