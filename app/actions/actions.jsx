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

export var login = (uid, email) => {
  return{
    type: 'LOGIN',
    uid,
    email
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

//Actions for UserApp
export var startUsers = () => {
   return (dispatch) => {
   var usersRef = firebaseRef.child('users');
   usersRef.once('value').then((snapshot) => {
    var users = snapshot.val();
    var parsedUsers = [];

    Object.keys(users).forEach((userId)=> {
      var user = users[userId]
      parsedUsers.push({
        key: userId,
        name: user.name,
        email: user.email,
        assignedCentres : user.assignedCentres,
        assignedRoles : user.assignedRoles
      });
    });
    dispatch(addUsers(parsedUsers));
  });
};
};

export var addUsers = (users) => {
  return {
    type: 'ADD_USERS',
    users
  };
};

export var addUser = (user) => {
  var usersRef = firebaseRef.child('users');
  var newKey = usersRef.push().key;
  var updates = {};
  updates[newKey] = user;
  usersRef.update(updates);
  user.key = newKey;
  return {
    type: 'ADD_USER',
    user
  };
}

export var updateUser = (user, userId) => {
  var usersRef = firebaseRef.child('users/' + userId);
  var updates = user
  usersRef.update(updates);
  return {
    type: 'UPDATE_USER',
    user,
    userId
  };
}


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
          return '6';
          break;
        case '9':
          return '5';
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
                  contact: trials.parent_contactno,
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

    return trialsRef.orderByChild("dateOfTrial").startAt("2017-01-01").once("value").then((snapshot) => {
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

export var updateTrial = (trial) => {
  var trialsRef = firebaseRef.child('trials/' + trial.id);
  trialsRef.update({
    childName: trial.childName,
    contact: trial.contact,
    email: trial.email,
    gender: trial.gender,
    venueId: trial.venueId,
    dateOfBirth: trial.dateOfBirth,
    dateOfTrial: trial.dateOfTrial,
    timeOfTrial: trial.timeOfTrial,
    parentName: trial.parentName,
    medicalCondition: trial.medicalCondition
  });
  return {
    type: 'UPDATE_TRIAL',
    trial
  };
};

export var updateTrialRegistration = (trialId) => {
  var trialsRef = firebaseRef.child('trials/' + trialId);
  trialsRef.once('value').then((snapshot) => {
    var updates = snapshot.val()
    updates.registered = true
    updates.dateRegistered = moment().format('YYYY-MM-DD')
    trialsRef.update(updates);
  })
  return {
    type: 'UPDATE_TRIAL_REGISTRATION',
    trialId
  }
}

export var addTrial = (trial) => {
  var trialsRef = firebaseRef.child('trials');
  var newKey = trialsRef.push().key;
  var updates = {};
  updates[newKey] = {
    childName: trial.childName,
    contact: trial.contact,
    email: trial.email,
    gender: trial.gender,
    venueId: trial.venueId,
    dateAdded: moment().format('YYYY-MM-DD'),
    dateOfBirth: trial.dateOfBirth,
    dateOfTrial: trial.dateOfTrial,
    timeOfTrial: trial.timeOfTrial,
    parentName: trial.parentName,
    medicalCondition: trial.medicalCondition
  };
  trialsRef.update(updates);
  trial.id = newKey;
  return {
    type: 'ADD_TRIAL',
    trial
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



//Students Profile
export var startStudents = () => {
   return (dispatch) => {
   var studentsRef = firebaseRef.child('students');
   studentsRef.once('value').then((snapshot) => {
    var students = snapshot.val();
    var parsedStudents = [];

    Object.keys(students).forEach((studentId)=> {
      parsedStudents.push({
        key: studentId,
        ...students[studentId]
      });
    });
    dispatch(addStudents(parsedStudents));
  });
};
};

export var addStudents = (students) => {
  return {
    type: 'ADD_STUDENTS',
    students
  };
};

export var addStudent = (student) => {
  var studentRef = firebaseRef.child('students');
  var newKey = studentRef.push().key;
  var updates = {};
  updates[newKey] = student;
  studentRef.update(updates);
  student.key = newKey;
  return {
    type: 'ADD_STUDENT',
    student
  };
}

export var addTrialStudent = (student) => {
  var studentRef = firebaseRef.child('students');
  var newKey = studentRef.push().key;
  var updates = {};
  updates[newKey] = {
    trialId : student.id,
    address : student.address,
    ageGroup : student.ageGroup,
    childName : student.childName,
    contact: student.contact,
    currentClassDay : student.currentClassDay,
    currentClassTime : student.currentClassTime,
    dateAdded: moment().format('YYYY-MM-DD'),
    dateOfBirth : student.dateOfBirth,
    email: student.email,
    gender: student.gender,
    parentName: student.parentName,
    medicalCondition: student.medicalCondition,
    venueId: student.venueId,
    centre : student.centre
   }
  studentRef.update(updates);
  student.key = newKey;
  return {
    type: 'ADD_STUDENT',
    student
  };
}

export var updateStudent = (studentId, student) => {
  var updates=  {};
  updates['/students/'+ studentId] = student;
  firebase.database().ref().update(updates);
  return {
    type: 'UPDATE_STUDENT',
    studentId,
    student
  };
};

export var updateAttendance = (date, id) => {
  return (dispatch) => {
    var attendanceRef = firebaseRef.child('students/'+id+'/attendance/'+date);
    attendanceRef.once('value').then((snapshot) => {
      var attendance = snapshot.val();
      if (attendance === null) {
        attendance = {}
      }
          attendance.attended = (attendance.attended === undefined) || (attendance.attended === false) ? true : false;

      return attendanceRef.update({
        attended : attendance.attended
      });
    }).then(() => {
      dispatch(toggleAttendance(date, id));
    });
  }
};

export var toggleAttendance = (date, id) => {
  return {
    type: 'TOGGLE_ATTENDANCE',
    date,
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
        ...coaches[coachId]
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

export var addCoach = (coach) => {
  var coachesRef = firebaseRef.child('coaches');
  var newKey = coachesRef.push().key;
  var updates = {};
  updates[newKey] = coach;
  coachesRef.update(updates);
  coach.key = newKey;
  return {
    type: 'ADD_COACH',
    coach
  };
};

export var updateCoach = (coachId, coach) => {
  var updates=  {};
  updates['/coaches/'+ coachId] = coach;
  firebase.database().ref().update(updates);
  return {
    type: 'UPDATE_COACH',
    coachId,
    coach
  };
};

export var updateCoachAttendance = (date, id, classKey, paymentRate) => {
  return (dispatch) => {
    var classId = null;
    var sessionRate = null;
    var attendanceRef = firebaseRef.child('coaches/'+id+'/attendance/'+date);
    attendanceRef.once('value').then((snapshot) => {
      var attendance = snapshot.val();
      if (attendance === null) {
        attendance = {}
      }
          attendance.attended = (attendance.attended === undefined) || (attendance.attended === false) ? true : null;


      if (attendance.attended) {
        classId = classKey
        sessionRate = paymentRate
      }

      return attendanceRef.update({
        attended : attendance.attended,
        classId,
        sessionRate
      });
    }).then(() => {
      dispatch(toggleCoachAttendance(date, id, classId, sessionRate));
    });
  }
};

export var toggleCoachAttendance = (date, id, classId, sessionRate) => {
  return {
    type: 'TOGGLE_COACH_ATTENDANCE',
    date,
    id,
    classId,
    sessionRate
  };
};


//Centre Profile
export var startCentres = () => {
   return (dispatch) => {
   var centreRef = firebaseRef.child('centres');
   centreRef.orderByChild('id').once('value').then((snapshot) => {
    var centres = snapshot.val();
    var parsedCentres = [];

    Object.keys(centres).forEach((centreId)=> {
      parsedCentres.push({
        key: centreId,
        id: centres[centreId].id,
        name: centres[centreId].name,
        logoURL: centres[centreId].logoURL,
        classes: centres[centreId].classes
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
  updates['/centres/'+ centre.key+'/logoURL'] = centre.logoURL;
  updates['/centres/'+ centre.key+'/name'] = centre.name;
  firebase.database().ref().update(updates);
  return {
    type: 'UPDATE_CENTRE',
    centre
  };
};

export var updateSelectedCentre = (centre) => {
  return {
    type: 'UPDATE_SELECTED_CENTRE',
    centre
  };
};


export var addClass = (cla, centreKey) => {
  var classRef = firebase.database().ref('/centres/' + centreKey+'/classes');
  var classKey = classRef.push().key;
  var updates = {};
  updates[classKey] = cla;
  classRef.update(updates);
  cla.key = classKey;
  return {
    type: 'ADD_CLASS',
    centreKey,
    cla
  };
};

export var deleteClass = (centreKey, classKey) => {
  var ClassRef = firebase.database().ref('/centres/' + centreKey + '/classes/' + classKey);
  ClassRef.remove();
  return {
    type: 'DELETE_CLASS',
    centreKey,
    classKey
  }
}

//calendars

export var startCalendars = () => {
  return (dispatch) => {
  var CalendarRef = firebaseRef.child('calendars');
  var parsedCalendars = [];
  return CalendarRef.once('value').then((snapshot) => {
    var value = snapshot.val();
    if (value !== null){
      Object.keys(value).forEach((termKey) => {
        parsedCalendars.push({
          key: termKey,
          name: value[termKey].name,
          terms: value[termKey].terms,
          centreKey: value[termKey].centreKey
        });
      });
      dispatch(addCalendars(parsedCalendars));
    }
  });
    }
};

export var addCalendars = (calendars) => {
  return {
    type: 'ADD_CALENDARS',
    calendars
  }
};

export var addTerm = (centreKey, terms, termName) => {
  var CalendarRef = firebase.database().ref('calendars');
  var termKey = CalendarRef.push().key;
  var updates = {};
  updates[termKey] = {
    centreKey,
    name: termName,
    terms: terms
  };
  CalendarRef.update(updates);
  return {
    type: 'ADD_TERM',
    centreKey,
    terms,
    termKey,
    name: termName
  };
};

export var updateTerm = (centreKey, terms, termName, calendarKey) => {
  var CalendarRef = firebase.database().ref('calendars');
  var updates = {};
  updates[calendarKey] = {
    centreKey,
    name: termName,
    terms: terms
  };
  CalendarRef.update(updates);
  return {
    type: 'UPDATE_TERM',
    centreKey,
    terms,
    calendarKey,
    name: termName
  };
};

export var deleteTerm = (termKey) => {
  var CalendarRef = firebase.database().ref('calendars/' + termKey);
  CalendarRef.remove();
  return {
    type: 'DELETE_TERM',
    termKey
  }
};


//Schedule
export var toggleSchedule = (classKey, date, val) => {
  var ScheduleRef = firebase.database().ref('coachSchedule/'+classKey);
  var updates = {
    [date] : {
      assigned: val
    }
  };
  ScheduleRef.update(updates);
  return {
    type: 'TOGGLE_SCHEDULE',
    classKey,
    date,
    val
  };
};

export var startCoachSchedule = () => {
  return (dispatch) => {
  var CoachScheduleRef = firebase.database().ref('coachSchedule');
  var parsedSchedule = [];
  return CoachScheduleRef.once('value').then((snapshot) => {
    var value = snapshot.val();
    if (value !== null){
      Object.keys(value).forEach((classId) => {
           var schedule = value[classId];
        Object.keys(schedule).forEach((date)=> {
          parsedSchedule.push({
            classKey: classId,
            date : date,
            scheduleKey: classId+date,
            assigned: schedule[date].assigned
          });
        })

      });
      dispatch(addCoachSchedule(parsedSchedule));
    }
  });
    }
}

export var addCoachSchedule = (coachSchedule) => {
  return {
    type: 'ADD_COACHSCHEDULE',
    coachSchedule
  }
};

// Search
export var setSearchText = (searchText) => {
  return {
    type: 'SET_SEARCH_TEXT',
    searchText
  };
};

//Term Dates
export var updateSelectedDays = (id, selectedDays) => {
  return {
    type: 'UPDATE_TERM_SELECTED_DAYS',
    id,
    selectedDays
  }
}

export var startTerms = (terms) => {
  return {
    type: 'START_TERMS',
    terms
  }
}

export var resetTerms = () => {
  return {
    type: 'RESET_TERMS'
  }
}

//Settings
export var startAgeGroup = () => {
   return (dispatch) => {
   var ageGroupRef = firebaseRef.child('ageGroup');
   ageGroupRef.once('value').then((snapshot) => {
    var ageGroup = snapshot.val();
    var parsedAgeGroup = [];

    Object.keys(ageGroup).forEach((ageGroupId)=> {
      parsedAgeGroup.push({
        key: ageGroupId,
        name: ageGroup[ageGroupId].name,
        minAge: ageGroup[ageGroupId].minAge,
        maxAge: ageGroup[ageGroupId].maxAge
      });
    });
    dispatch(addAgeGroups(parsedAgeGroup));
  });
};
};

export var addAgeGroups = (ageGroups) => {
  return {
    type: 'ADD_AGE_GROUPS',
    ageGroups
  };
};

export var addAgeGroup = (ageGroup) => {
  var ageGroupRef = firebaseRef.child('ageGroup');
  var newKey = ageGroupRef.push().key;
  var updates = {};
  updates[newKey] = ageGroup;
  ageGroupRef.update(updates);
  ageGroup.key = newKey;
  return {
    type: 'ADD_AGE_GROUP',
    ageGroup
  }
}

export var updateAgeGroup = (ageGroup) => {
  var updates=  {};
  updates['/ageGroup/'+ ageGroup.key] = ageGroup;
  firebase.database().ref().update(updates);
  var key = ageGroup.key;
  return {
    type: 'UPDATE_AGE_GROUP',
    key,
    ageGroup
  };
};

export var resetAgeGroup = () => {
  return {
    type: 'RESET_AGE_GROUP'
  }
}

//Payment


export var addPayment = (paymentDetails) => {
  return (dispatch) => {
    var paymentRef = firebaseRef.child('payments');
    var newKey = paymentRef.push().key;
    var updates = {}
    updates[newKey] = paymentDetails;
    paymentRef.update(updates);
    paymentDetails.key = newKey;
    dispatch(addPaymentRecord(paymentDetails))
    dispatch(addStudentPayment(paymentDetails))
  }
}

export var addPaymentRecord = (paymentDetails) => {
  return {
    type: 'ADD_PAYMENT',
    paymentDetails
  }
}

export var addStudentPayment = (paymentDetails) => {
   var studentRef = firebaseRef.child('students/' + paymentDetails.childKey +'/payments');
   var newKey = studentRef.push().key;
   var updates = {}
   updates[newKey] = {
     paymentKey: paymentDetails.key,
     date: paymentDetails.date,
     termsPaid: paymentDetails.termsPaid,
     total: paymentDetails.total
   }
   studentRef.update(updates);
   return {
     type: 'ADD_STUDENT_PAYMENT',
     paymentDetails,
     key: newKey
   }
}

export var startPayments = () => {
  return (dispatch) => {
  var paymentRef = firebaseRef.child('payments');
  paymentRef.once('value').then((snapshot) => {
   var payments = snapshot.val();
   if (payments !== null) {
     var parsedPayments = [];

     Object.keys(payments).forEach((paymentId)=> {
       var payment = payments[paymentId]
       if (payment.paymentMethod === 'Cash') {
         parsedPayments.push({
           key: paymentId,
           ageGroup: payment.ageGroup,
           centreId: payment.centreId,
           childName: payment.childName,
           childKey: payment.childKey,
           date: payment.date,
           earlyBird: payment.earlyBird,
           email: payment.email,
           paymentMethod: payment.paymentMethod,
           siblingDiscount: payment.siblingDiscount,
           termsPaid: payment.termsPaid,
           total: payment.total,
           jerseyIssued : payment.jerseyIssued
         });
       }
       else if (payment.paymentMethod === 'Cheque'){
         parsedPayments.push({
           key: paymentId,
           ageGroup: payment.ageGroup,
           centreId: payment.centreId,
           childName: payment.childName,
           childKey: payment.childKey,
           date: payment.date,
           earlyBird: payment.earlyBird,
           email: payment.email,
           paymentMethod: payment.paymentMethod,
           siblingDiscount: payment.siblingDiscount,
           chequeNumber: payment.chequeNumber === null || payment.chequeNumber === undefined ? '':payment.chequeNumber,
           termsPaid: payment.termsPaid,
           total: payment.total,
           jerseyIssued : payment.jerseyIssued
         });
       }

     });
     dispatch(addPayments(parsedPayments));
   }
 });
};
};

export var addPayments = (payments) => {
 return {
   type: 'ADD_PAYMENTS',
   payments
 };
};

export var issueJersey = (payment) => {
  var updates={};
  updates['/payments/'+ payment.key] = payment
  firebase.database().ref().update(updates);
  return {
    type: 'ISSUE_JERSEY',
    payment
  };
}

//Inventory Actions
export var startInventory = () => {
  return (dispatch) => {
  var inventoryRef = firebaseRef.child('inventory');
  inventoryRef.once('value').then((snapshot) => {
   var inventory= snapshot.val();
   if (inventory !== null) {
     var parsedInventory = [];

     Object.keys(inventory).forEach((itemId)=> {
       parsedInventory.push({
         key: itemId,
         name: inventory[itemId].name,
         qty: inventory[itemId].qty,
         size: inventory[itemId].size,
         minQty: inventory[itemId].minQty,
         costPrice : inventory[itemId].costPrice,
         sellingPrice: inventory[itemId].sellingPrice
       });
     });
     dispatch(addInventories(parsedInventory));
   }
  });

  }
}

export var addInventories = (inventories) => {
  return {
    type: 'ADD_INVENTORIES',
    inventories
  };
};



//Registration Actions
export var addRegister = (payers) => {
  return {
    type: 'ADD_REGISTER',
    payers
  }
}

export var updateRegister = (trial) => {
  return {
    type: 'UPDATE_REGISTER',
    trial
  }
}

export var updateJoining = (id) => {
  return {
    type: 'UPDATE_JOINING',
    id
  }
}

export var updateParentDetails = (parentDetails) => {
  return {
    type: 'UPDATE_PARENT',
    parentDetails
  }
}
