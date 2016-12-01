import firebase, {firebaseRef} from 'app/firebase';
import axios from 'axios'
import moment from 'moment'

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

//Actions for TrialsApp
export var startAddTrials = () => {
  return (dispatch) => {
    var capitalize = (word) => {
      var sa = word.replace(/-/g,' ');
      var saa = sa.toLowerCase();
      var sb = saa.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
      var sc = sb.replace(/\s+/g, ' ');
      return sc;
    };
    var venueId = 0;
    var reId = (id) => {
      switch (id) {
        case '1':
          return '1';
          break;
        case '6':
          return '2';
          break;
        case '2':
          return '3';
          break;
        case '7':
          return '4';
          break;
        case '5':
          return '5';
          break;
        case '9':
          return '6';
          break;
        case '8':
          return '7';
          break;
        default:
          return 0;
          break;
        };
    };
    var trialsRef = firebaseRef.child('trials');
    axios.get("http://www.fka.sg/get-api-students")
      .then(function (response) {
        var trialList = response.data.data;
        trialsRef.once("value").then((snapshot) => {
          var firebaseTrialList = snapshot.val();
          trialList.forEach((trials) => {
            var trialExist = _.findKey(firebaseTrialList, {'childId': trials.child_id}) === undefined || '' ? false : true;
            if ( !trialExist) {
              trialsRef.push().set({
                  childId: trials.child_id,
                  childName: capitalize(trials.child_name),
                  gender: trials.gender,
                  dateOfBirth: trials.dateofbirth,
                  medicalHistory: trials.medicalhistory,
                  medicalCondition: trials.medicalcondationnote,
                  dateAdded: trials.date_added,
                  parentId: trials.parent_id,
                  parentName: capitalize(trials.parent_name),
                  email: trials.parent_email,
                  contactNumber: trials.parent_contactno,
                  venueId: reId(trials.venue_id),
                  dateOfTrial: trials.dateoftrail,
                  timeOfTrial: trials.timeoftrail,
                  attended: false,
                  attendedOn: null
                });
              }
            });
        });
  })
    .catch(function (response) {
      console.log(response);
  });

    return trialsRef.orderByChild("dateOfTrial").startAt("2016-06-01").once("value").then((snapshot) => {
      var trials = snapshot.val() || {};
      var parsedTrials = [];

      Object.keys(trials).forEach((trialId) => {
        parsedTrials.push({
          id: trialId,
          ...trials[trialId]
        });
      });
      dispatch(addTrials(parsedTrials));
    });
  };
};

export var addTrials = (trials) => {
  return {
    type: 'ADD_TRIALS',
    trials
  };
};

export var startToggleTrial = (id) => {
  return (dispatch) => {
    var trialsRef = firebaseRef.child('trials/' + id);

    return trialsRef.once('value').then((snapshot) => {
      var val = snapshot.val();
      var attended = (val.attended === undefined) || (val.attended === false) ? true : false;
      var attendedOn = attended ? moment().unix() : null;
      return trialsRef.update({
        attended,
        attendedOn
      });
    }).then(() => {
      dispatch(toggleTrial(id));
    });
  }
};

export var toggleTrial = (id) => {
  return {
    type: 'TOGGLE_TRIAL',
    id
  };
};


//Coaches Profile
export var startCoaches = () => {
   return (dispatch) => {
   var coachesRef = firebaseRef.child('coaches');
   coachesRef.once('value').then((snapshot) => {
    var coaches = snapshot.val();
    var parsedCoaches = [];

    Object.keys(coaches).forEach((coachId)=> {
      parsedCoaches.push({
        key: coachId,
        name: coaches[coachId].name,
        nric: coaches[coachId].nric,
        dateOfBirth: coaches[coachId].dateOfBirth,
        address: coaches[coachId].address,
        contact: coaches[coachId].contact,
        email: coaches[coachId].email,
        education: coaches[coachId].education,
        occupation: coaches[coachId].occupation,
        bank: coaches[coachId].bank,
        accountNumber: coaches[coachId].accountNumber,
        paymentRate: coaches[coachId].paymentRate,
        transport: coaches[coachId].modeOfTransport,
        centres: coaches[coachId].centres,
        qualification: coaches[coachId].qualification,
        startDate: coaches[coachId].startDate,
        firstAid: coaches[coachId].firstAid,
        issueDate: coaches[coachId].issueDate
      });
    });
    dispatch(addCoaches(parsedCoaches));
  });
};
};

export var addCoaches = (coaches) => {
  return {
    type: 'ADD_COACHES',
    coaches
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
        key: centreId,
        id: centres[centreId].id,
        name: centres[centreId].name
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
  var updates=  {};
  updates['/centres/'+centre.key] = {
   id : centre.id,
   name : centre.name
 };
  firebase.database().ref().update(updates);
  return {
    type: 'UPDATE_CENTRE',
    centre
  };
};

export var updateSelectedCentre = (id) => {
  return {
    type: 'UPDATE_SELECTED_CENTRE',
    id
  };
};

// Search
export var setSearchText = (searchText) => {
  return {
    type: 'SET_SEARCH_TEXT',
    searchText
  };
};
