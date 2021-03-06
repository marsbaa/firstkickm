import firebase, { firebaseRef } from "firebaseApp";
import axios from "axios";
import moment from "moment";

//Navbar
export var updateNavTitle = (link, title) => {
  return { type: "UPDATE_NAV_TITLE", link, title };
};

//Actions for UserApp
export var startUsers = () => {
  return dispatch => {
    var usersRef = firebaseRef.child("users");
    usersRef.once("value").then(snapshot => {
      var users = snapshot.val();
      var parsedUsers = [];

      Object.keys(users).forEach(userId => {
        var user = users[userId];
        parsedUsers.push({
          key: userId,
          name: user.name,
          email: user.email,
          assignedCentres: user.assignedCentres,
          assignedRoles: user.assignedRoles
        });
      });
      dispatch(addUsers(parsedUsers));
    });
  };
};

export var addUsers = users => {
  return { type: "ADD_USERS", users };
};

export var addUser = user => {
  var usersRef = firebaseRef.child("users");
  var newKey = usersRef.push().key;
  var updates = {};
  updates[newKey] = user;
  usersRef.update(updates);
  user.key = newKey;
  return { type: "ADD_USER", user };
};

export var updateUser = (user, userId) => {
  var usersRef = firebaseRef.child("users/" + userId);
  var updates = user;
  usersRef.update(updates);
  return { type: "UPDATE_USER", user, userId };
};

//Actions for TrialsApp
export var startAddTrials = () => {
  return dispatch => {
    dispatch({ type: "IS_FETCHING", completed: false });
    var capitalize = word => {
      var sa = word.replace(/-/g, " ");
      var saa = sa.toLowerCase();
      var sb = saa.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
        return p1 + p2.toUpperCase();
      });
      var sc = sb.replace(/\s+/g, " ");
      return sc;
    };
    var venueId = 0;
    var reId = id => {
      switch (id) {
        case "1":
          return "1";
          break;
        case "6":
          return "2";
          break;
        case "2":
          return "3";
          break;
        case "7":
          return "4";
          break;
        case "5":
          return "6";
          break;
        case "9":
          return "5";
          break;
        case "8":
          return "7";
          break;
        default:
          return 0;
          break;
      }
    };
    var trialsRef = firebaseRef.child("trials");
    axios
      .get("https://www.fka.sg/trialstudents/")
      .then(function(response) {
        var trialList = response.data.data;
        trialsRef.once("value").then(snapshot => {
          var firebaseTrialList = snapshot.val();
          trialList.forEach(trials => {
            var trialExist =
              _.findKey(firebaseTrialList, { childId: trials.child_id }) ===
                undefined || ""
                ? false
                : true;
            if (!trialExist) {
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
      .catch(function(response) {
        console.log(response);
      });

    return trialsRef
      .orderByChild("dateOfTrial")
      .startAt("2017-06-01")
      .once("value")
      .then(snapshot => {
        var trials = snapshot.val() || {};
        var parsedTrials = [];

        Object.keys(trials).forEach(trialId => {
          if (trials[trialId].attended === undefined) {
            parsedTrials.push({
              id: trialId,
              attended: false,
              attendedOn: null,
              ...trials[trialId]
            });
          } else {
            parsedTrials.push({
              id: trialId,
              ...trials[trialId]
            });
          }
        });
        dispatch(addTrials(parsedTrials));
        dispatch({ type: "IS_FETCHING", completed: true });
      });
  };
};

export var addTrials = trials => {
  return { type: "ADD_TRIALS", trials };
};

export var updateTrial = trial => {
  var trialsRef = firebaseRef.child("trials/" + trial.id);
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
    medicalCondition: trial.medicalCondition,
    attended: trial.attended,
    attendedOn: trial.attendedOn
  });
  return { type: "UPDATE_TRIAL", trial };
};

export var updateTrialRegistration = trialId => {
  var trialsRef = firebaseRef.child("trials/" + trialId);
  trialsRef.once("value").then(snapshot => {
    var updates = snapshot.val();
    updates.registered = true;
    updates.dateRegistered = moment().format("YYYY-MM-DD");
    trialsRef.update(updates);
  });
  return { type: "UPDATE_TRIAL_REGISTRATION", trialId };
};

export var addTrial = trial => {
  var trialsRef = firebaseRef.child("trials");
  var newKey = trialsRef.push().key;
  var updates = {};
  updates[newKey] = {
    childName: trial.childName,
    contact: trial.contact,
    email: trial.email,
    gender: trial.gender,
    venueId: trial.venueId,
    dateAdded: moment().format("YYYY-MM-DD"),
    dateOfBirth: trial.dateOfBirth,
    dateOfTrial: trial.dateOfTrial,
    timeOfTrial: trial.timeOfTrial,
    parentName: trial.parentName,
    medicalCondition: trial.medicalCondition,
    attended: false,
    attendedOn: null
  };
  trialsRef.update(updates);
  trial.id = newKey;
  return { type: "ADD_TRIAL", trial };
};

export var startToggleTrial = id => {
  return dispatch => {
    var trialsRef = firebaseRef.child("trials/" + id);

    return trialsRef
      .once("value")
      .then(snapshot => {
        var val = snapshot.val();
        var attended =
          val.attended === undefined || val.attended === false ? true : false;
        var attendedOn = attended ? moment().format() : null;
        return trialsRef.update({ attended, attendedOn });
      })
      .then(() => {
        dispatch(toggleTrial(id));
      });
  };
};

export var toggleTrial = id => {
  return { type: "TOGGLE_TRIAL", id };
};

export var addDeposit = (deposit, id) => {
  var trialsRef = firebaseRef.child("trials/" + id);
  var date = moment().format();
  trialsRef.once("value").then(snapshot => {
    var updates = snapshot.val();
    updates.deposit = deposit;
    updates.depositCollected = date;
    updates.depositCleared = false;
    trialsRef.update(updates);
  });
  return { type: "ADD_DEPOSIT", deposit, date, id };
};

//OpenHouse Actions
export var startOpenHouse = () => {
  return dispatch => {
    const openhouseRef = firebaseRef.child("openhouse");
    openhouseRef.once("value").then(snapshot => {
      var openhouse = snapshot.val();
      var parsedOpenHouse = [];

      Object.keys(openhouse).map(id => {
        const { selectedSession } = openhouse[id];
        const splitS = selectedSession.split(", ");
        const date = splitS[1].split(" ");
        const formattedDate =
          "2017-" + date[1].slice(0, 3) + "-" + date[0].slice(0, 2);
        const startTime = splitS[2].slice(0, 1) + ":00" + splitS[2].slice(1, 3);
        parsedOpenHouse.push({
          key: id,
          ...openhouse[id],
          centreName: splitS[0],
          dateOfTrial: moment(formattedDate, "YYYY-MMM-DD").format(
            "YYYY-MM-DD"
          ),
          startTime
        });
      });
      dispatch(addOpenHouse(parsedOpenHouse));
    });
  };
};

export var addOpenHouse = openhouse => {
  return { type: "ADD_OPENHOUSE", openhouse };
};

export var updateOpenhouse = trial => {
  var openhouseRef = firebaseRef.child("openhouse/" + trial.key);
  openhouseRef.update({
    childName: trial.childName,
    contact: trial.contact,
    email: trial.email,
    gender: trial.gender,
    venueId: trial.venueId,
    dateOfBirth: trial.dateOfBirth,
    dateOfTrial: trial.dateOfTrial,
    timeOfTrial: trial.timeOfTrial,
    parentName: trial.name,
    medicalCondition: trial.medicalCondition,
    attended: trial.attended,
    attendedOn: trial.attendedOn
  });
  return { type: "UPDATE_OPENHOUSE", trial };
};

export var startToggleOpenhouse = key => {
  return dispatch => {
    var openhouseRef = firebaseRef.child("openhouse/" + key);

    return openhouseRef
      .once("value")
      .then(snapshot => {
        var val = snapshot.val();
        var attended =
          val.attended === undefined || val.attended === false ? true : false;
        var attendedOn = attended ? moment().format() : null;
        return openhouseRef.update({ attended, attendedOn });
      })
      .then(() => {
        dispatch(toggleOpenhouse(key));
      });
  };
};

export var updateOpenhouseRegistration = key => {
  var openhouseRef = firebaseRef.child("openhouse/" + key);
  openhouseRef.once("value").then(snapshot => {
    var updates = snapshot.val();
    updates.registered = true;
    updates.dateRegistered = moment().format("YYYY-MM-DD");
    openhouseRef.update(updates);
  });
  return { type: "UPDATE_OPENHOUSE_REGISTRATION", key };
};

export var toggleOpenhouse = key => {
  return { type: "TOGGLE_OPENHOUSE", key };
};

export var addOHDeposit = (deposit, key) => {
  var openhouseRef = firebaseRef.child("openhouse/" + key);
  var date = moment().format();
  openhouseRef.once("value").then(snapshot => {
    var updates = snapshot.val();
    updates.deposit = deposit;
    updates.depositCollected = date;
    updates.depositCleared = false;
    openhouseRef.update(updates);
  });
  return { type: "ADD_OH_DEPOSIT", deposit, date, key };
};

//Students Profile
export var startStudents = () => {
  return dispatch => {
    var studentsRef = firebaseRef.child("students");
    studentsRef.once("value").then(snapshot => {
      var students = snapshot.val();
      var parsedStudents = [];

      Object.keys(students).map(studentId => {
        parsedStudents.push({
          key: studentId,
          ...students[studentId]
        });
      });
      dispatch(addStudents(parsedStudents));
    });
  };
};

export var addStudents = students => {
  return { type: "ADD_STUDENTS", students };
};

export var addStudent = student => {
  var studentRef = firebaseRef.child("students");
  var newKey = studentRef.push().key;
  var updates = {};
  updates[newKey] = student;
  studentRef.update(updates);
  student.key = newKey;
  return { type: "ADD_STUDENT", student };
};

export var deleteStudent = key => {
  var studentRef = firebaseRef.child("students/" + key);
  studentRef.remove();
  return { type: "DELETE_STUDENT", key };
};

/*export var deleteDuplicateStudent = () => {
  return (dispatch) => {
    var studentRef = firebaseRef.child('students');
    var newStudents = {}
    studentRef.once('value').then((snapshot) => {
      var students = snapshot.val();
      newStudents = _.omitBy(students, {'venueId': undefined})
      studentRef.set(newStudents)
    })

  }
};*/

export var addTrialStudent = student => {
  var studentRef = firebaseRef.child("students");
  var newKey = studentRef.push().key;
  var updates = {};
  updates[newKey] = {
    dateAdded: moment().format(),
    ...student
  };
  studentRef.update(updates);
  student.key = newKey;
  return { type: "ADD_STUDENT", student };
};

export var addOpenhouseStudent = student => {
  var studentRef = firebaseRef.child("students");
  var newKey = studentRef.push().key;
  var updates = {};
  updates[newKey] = {
    trialId: student.key,
    address: student.address,
    ageGroup: student.ageGroup,
    childName: student.childName,
    contact: student.contact,
    currentClassDay: student.currentClassDay,
    currentClassTime: student.currentClassTime,
    dateAdded: moment().format("YYYY-MM-DD"),
    dateOfBirth: student.dateOfBirth,
    email: student.email,
    gender: student.gender,
    parentName: student.parentName,
    medicalCondition: student.medicalCondition,
    venueId: student.venueId,
    centre: student.centre
  };
  studentRef.update(updates);
  student.key = newKey;
  return { type: "ADD_STUDENT", student };
};

export var updateStudent = (studentId, student) => {
  var updates = {};
  updates["/students/" + studentId] = student;
  firebase
    .database()
    .ref()
    .update(updates);
  return { type: "UPDATE_STUDENT", studentId, student };
};

export var updateAttendance = (date, id) => {
  return dispatch => {
    var attendanceRef = firebaseRef.child(
      "students/" + id + "/attendance/" + date
    );
    attendanceRef
      .once("value")
      .then(snapshot => {
        var attendance = snapshot.val();
        if (attendance === null) {
          return attendanceRef.update({ attended: true });
        } else if (attendance.attended === true) {
          return attendanceRef.remove();
        }
      })
      .then(() => {
        dispatch(toggleAttendance(date, id));
      });
  };
};

export var toggleAttendance = (date, id) => {
  return { type: "TOGGLE_ATTENDANCE", date, id };
};

/*
export var updateCoachDate = () => {
  return (dispatch) => {
  var coachesRef = firebaseRef.child('coaches');
  var updates = {}
  updates['/-Ki9uPBf2g8vmkAVmcr1/attendance/'] = {
    "2017-04-22" :
      {
        attended: true,
        classId: "-Ke7pOCCob3ZzXDoeRHE",
        sessionRate: "40"
      }
  }
  updates['/-Ki9uPBqhbVSckDgMCQM/attendance/'] = {
    "2017-04-22" :
      {
        attended: true,
        classId: "-Ke7pJoE2XfUra23Zjye",
        sessionRate: "40"
      }
  }
  updates['/-Ki9uPCcT8YYR8fcyP_u/attendance/'] = {
    "2017-04-22" :
      {
        attended: true,
        classId: "-Ke7p_oT0J_pSq4hfyAz",
        sessionRate: "50"
      }
  }
  updates['/-Ki9uPHNU9GKyVb4NTtI/attendance/'] = {
    "2017-04-22" :
      {
        attended: true,
        classId: "-Ke7pJoE2XfUra23Zjye",
        sessionRate: "70"
      }
  }
  updates['/-Ki9uPIQssySbHb_lN7J/attendance/'] = {
    "2017-04-22" :
      {
        attended: true,
        classId: "-Ke7pJoE2XfUra23Zjye",
        sessionRate: "30"
      }
  }
  coachesRef.update(updates)
}
}*/

export var updateCoachAttendance = (date, id, classKey, paymentRate) => {
  return dispatch => {
    var classId = null;
    var sessionRate = null;
    var attendanceRef = firebaseRef.child(
      "coaches/" + id + "/attendance/" + date
    );
    attendanceRef
      .once("value")
      .then(snapshot => {
        var attendance = snapshot.val();
        if (attendance === null) {
          attendance = {};
        }
        attendance.attended =
          attendance.attended === undefined || attendance.attended === false
            ? true
            : null;

        if (attendance.attended) {
          classId = classKey;
          sessionRate = paymentRate;
        }

        return attendanceRef.update({
          attended: attendance.attended,
          classId,
          sessionRate
        });
      })
      .then(() => {
        dispatch(toggleCoachAttendance(date, id, classId, sessionRate));
      });
  };
};

export var toggleCoachAttendance = (date, id, classId, sessionRate) => {
  return { type: "TOGGLE_COACH_ATTENDANCE", date, id, classId, sessionRate };
};

//Admin Profile
export var startAdmins = () => {
  return dispatch => {
    var adminsRef = firebaseRef.child("admins");
    adminsRef.once("value").then(snapshot => {
      var admins = snapshot.val();
      if (admins !== null) {
        var parsedAdmins = {};

        Object.keys(admins).forEach(adminId => {
          parsedAdmins[adminId] = admins[adminId];
          parsedAdmins[adminId].key = adminId;
        });
        dispatch(addAdmins(parsedAdmins));
      }
    });
  };
};

export var addNewAdmin = admin => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(admin.email, admin.password)
    .then(
      function() {
        // Update successful.
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(
          function() {
            // Email sent.
            console.log("Email Sent");
          },
          function(error) {
            console.log(error);
          }
        );
      },
      function(error) {
        // An error happened.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + errorMessage);
      }
    );

  var adminsRef = firebaseRef.child("admins");
  var newKey = adminsRef.push().key;
  var updates = {};
  updates[newKey] = admin;
  adminsRef.update(updates);
  admin.key = newKey;
  return { type: "ADD_ADMIN", admin };
};

export var addAdmins = admins => {
  return { type: "ADD_ADMINS", admins };
};

export var updateAdmin = (adminId, admin) => {
  var updates = {};
  updates["/admins/" + adminId] = admin;
  firebase
    .database()
    .ref()
    .update(updates);
  return { type: "UPDATE_ADMIN", adminId, admin };
};

export var deleteAdmin = adminId => {
  var adminsRef = firebaseRef.child("admins/" + adminId);
  adminsRef.remove();
  return { type: "DELETE_ADMIN", adminId };
};

//Centre Profile
export var startCentres = () => {
  return dispatch => {
    dispatch({ type: "IS_FETCHING", completed: false });
    var centreRef = firebaseRef.child("centres");
    centreRef
      .orderByChild("id")
      .once("value")
      .then(snapshot => {
        var centres = snapshot.val();
        var parsedCentres = [];

        Object.keys(centres).forEach(centreId => {
          parsedCentres[centreId] = {
            key: centreId,
            ...centres[centreId]
          };
        });
        dispatch({ type: "IS_FETCHING", completed: true });
        dispatch(addCentres(parsedCentres));
      });
  };
};

export var addCentres = centres => {
  return { type: "ADD_CENTRES", centres };
};

export var addCentre = centre => {
  var centreRef = firebaseRef.child("centres");
  var newKey = centreRef.push().key;
  var updates = {};
  updates[newKey] = centre;
  centreRef.update(updates);
  centre.key = newKey;
  return { type: "ADD_CENTRE", centre };
};

export var updateCentre = centre => {
  var updates = {};
  updates["/centres/" + centre.key + "/logoURL"] = centre.logoURL;
  updates["/centres/" + centre.key + "/name"] = centre.name;
  firebase
    .database()
    .ref()
    .update(updates);
  return { type: "UPDATE_CENTRE", centre };
};

export var updateSelectedCentre = centre => {
  return { type: "UPDATE_SELECTED_CENTRE", centre };
};

export var addClass = (cla, centreKey) => {
  var classRef = firebase.database().ref("/centres/" + centreKey + "/classes");
  var classKey = classRef.push().key;
  var updates = {};
  updates[classKey] = cla;
  classRef.update(updates);
  cla.key = classKey;
  return { type: "ADD_CLASS", centreKey, cla };
};

export var deleteClass = classKey => {
  var ClassRef = firebase.database().ref("/classes/" + classKey);
  ClassRef.remove();
  return { type: "DELETE_CLASS", classKey };
};

export var moveClasses = () => {
  return dispatch => {
    var centreRef = firebaseRef.child("centres");
    centreRef.once("value").then(snapshot => {
      var centres = snapshot.val();
      var parsedCentres = [];

      Object.keys(centres).map(centreId => {
        const { classes, id, name } = centres[centreId];
        Object.keys(classes).map(classKey => {
          const { ageGroup, startTime, endTime, day } = classes[classKey];
          let cla = {
            ...classes[classKey],
            name: `${ageGroup} ${startTime} - ${endTime} (${day})`,
            year: 2017,
            centreName: name,
            venueId: id,
            centreKey: centreId
          };
          dispatch(addNewClass(cla));
        });
      });
    });
  };
};

export var addNewClass = cla => {
  var ClassRef = firebase.database().ref("classes");
  var classKey = ClassRef.push().key;
  var updates = {};
  updates[classKey] = cla;
  ClassRef.update(updates);
  cla.key = classKey;
  return { type: "ADD_NEW_CLASS", cla };
};

//calendars

export var startCalendars = () => {
  return dispatch => {
    var CalendarRef = firebaseRef.child("calendars");
    var parsedCalendars = {};
    return CalendarRef.once("value").then(snapshot => {
      var value = snapshot.val();
      if (value !== null) {
        Object.keys(value).forEach(calendarKey => {
          parsedCalendars[calendarKey] = {
            key: calendarKey,
            ...value[calendarKey]
          };
        });
        dispatch(addCalendars(parsedCalendars));
      }
    });
  };
};

export var addCalendars = calendars => {
  return { type: "ADD_CALENDARS", calendars };
};

export var addTerm = calendar => {
  var CalendarRef = firebase.database().ref("calendars");
  var calendarKey = CalendarRef.push().key;
  var updates = {};
  updates[calendarKey] = calendar;
  CalendarRef.update(updates);
  calendar.key = calendarKey;
  return { type: "ADD_TERM", calendar, calendarKey };
};

export var updateTerm = (calendar, calendarKey) => {
  var CalendarRef = firebase.database().ref("calendars");
  var updates = {};
  updates[calendarKey] = calendar;
  CalendarRef.update(updates);
  return { type: "UPDATE_TERM", calendar, calendarKey };
};

export var deleteTerm = calendarKey => {
  var CalendarRef = firebase.database().ref("calendars/" + calendarKey);
  CalendarRef.remove();
  return { type: "DELETE_TERM", calendarKey };
};

//Schedule
export var toggleSchedule = (classKey, date, val) => {
  var ScheduleRef = firebase.database().ref("coachSchedule/" + classKey);
  var updates = {
    [date]: {
      assigned: val
    }
  };
  ScheduleRef.update(updates);
  return { type: "TOGGLE_SCHEDULE", classKey, date, val };
};

export var startCoachSchedule = () => {
  return dispatch => {
    var CoachScheduleRef = firebase.database().ref("coachSchedule");
    var parsedSchedule = [];
    return CoachScheduleRef.once("value").then(snapshot => {
      var value = snapshot.val();
      if (value !== null) {
        Object.keys(value).forEach(classId => {
          var schedule = value[classId];
          Object.keys(schedule).forEach(date => {
            parsedSchedule.push({
              classKey: classId,
              date: date,
              scheduleKey: classId + date,
              assigned: schedule[date].assigned
            });
          });
        });
        dispatch(addCoachSchedule(parsedSchedule));
      }
    });
  };
};

export var addCoachSchedule = coachSchedule => {
  return { type: "ADD_COACHSCHEDULE", coachSchedule };
};

// Search
export var setSearchText = searchText => {
  return { type: "SET_SEARCH_TEXT", searchText };
};

export var resetSearchText = () => {
  return { type: "RESET_SEARCH_TEXT" };
};

//Term Dates
export var updateSelectedDays = (year, id, selectedDays) => {
  return { type: "UPDATE_TERM_SELECTED_DAYS", year, id, selectedDays };
};

export var startTerms = terms => {
  return { type: "START_TERMS", terms };
};

export var resetTerms = () => {
  return { type: "RESET_TERMS" };
};

//Settings
export var startAgeGroup = () => {
  return dispatch => {
    var ageGroupRef = firebaseRef.child("ageGroup");
    ageGroupRef.once("value").then(snapshot => {
      var ageGroup = snapshot.val();
      var parsedAgeGroup = [];

      Object.keys(ageGroup).forEach(ageGroupId => {
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

export var addAgeGroups = ageGroups => {
  return { type: "ADD_AGE_GROUPS", ageGroups };
};

export var addAgeGroup = ageGroup => {
  var ageGroupRef = firebaseRef.child("ageGroup");
  var newKey = ageGroupRef.push().key;
  var updates = {};
  updates[newKey] = ageGroup;
  ageGroupRef.update(updates);
  ageGroup.key = newKey;
  return { type: "ADD_AGE_GROUP", ageGroup };
};

export var updateAgeGroup = ageGroup => {
  var updates = {};
  updates["/ageGroup/" + ageGroup.key] = ageGroup;
  firebase
    .database()
    .ref()
    .update(updates);
  var key = ageGroup.key;
  return { type: "UPDATE_AGE_GROUP", key, ageGroup };
};

export var resetAgeGroup = () => {
  return { type: "RESET_AGE_GROUP" };
};

//Payment

export var addPayment = paymentDetails => {
  return dispatch => {
    var paymentRef = firebaseRef.child("payments");
    var newKey = paymentRef.push().key;
    var updates = {};
    updates[newKey] = paymentDetails;
    paymentRef.update(updates);
    paymentDetails.key = newKey;
    dispatch(addPaymentRecord(paymentDetails));
    dispatch(addStudentPayment(paymentDetails));
  };
};

export var removePayment = (paymentKey, childKey) => {
  return dispatch => {
    var paymentRef = firebaseRef.child("payments/" + paymentKey);
    paymentRef.remove();
    var childPaymentRef = firebaseRef.child(
      "students/" + childKey + "/payments"
    );
    childPaymentRef.once("value").then(snapshot => {
      var payments = snapshot.val();
      var childPaymentKey = "";
      Object.keys(payments).map(key => {
        if (payments[key].paymentKey === paymentKey) {
          childPaymentKey = key;
        }
      });
      var childUpdates = {};
      childUpdates[childPaymentKey] = null;
      childPaymentRef.update(childUpdates);
    });
    dispatch(removePaymentRecord(paymentKey));
    dispatch(removeStudentPayment(paymentKey, childKey));
  };
};

export var addPaymentRecord = paymentDetails => {
  return { type: "ADD_PAYMENT", paymentDetails };
};

export var removePaymentRecord = paymentKey => {
  return { type: "REMOVE_PAYMENT", paymentKey };
};

export var removeStudentPayment = (paymentKey, childKey) => {
  return { type: "REMOVE_STUDENT_PAYMENT", childKey, paymentKey };
};

export var addStudentPayment = paymentDetails => {
  var studentRef = firebaseRef.child(
    "students/" + paymentDetails.childKey + "/payments"
  );
  var newKey = studentRef.push().key;
  var updates = {};
  updates[newKey] = {
    paymentKey: paymentDetails.key,
    date: paymentDetails.date,
    termsPaid:
      paymentDetails.termsPaid === undefined ? null : paymentDetails.termsPaid,
    total: paymentDetails.total
  };
  studentRef.update(updates);
  return { type: "ADD_STUDENT_PAYMENT", paymentDetails, key: newKey };
};

export var startPayments = () => {
  return dispatch => {
    var paymentRef = firebaseRef.child("payments");
    paymentRef.once("value").then(snapshot => {
      var payments = snapshot.val();
      if (payments !== null) {
        var parsedPayments = [];

        Object.keys(payments).forEach(paymentId => {
          var payment = payments[paymentId];

          parsedPayments.push({
            key: paymentId,
            ...payment
          });
        });
        dispatch(addPayments(parsedPayments));
      }
    });
  };
};

export var addPayments = payments => {
  return { type: "ADD_PAYMENTS", payments };
};

export var issueJersey = payment => {
  var updates = {};
  updates["/payments/" + payment.key] = payment;
  firebase
    .database()
    .ref()
    .update(updates);
  return { type: "ISSUE_JERSEY", payment };
};

//Inventory Actions
export var startInventory = () => {
  return dispatch => {
    var inventoryRef = firebaseRef.child("inventory");
    inventoryRef.once("value").then(snapshot => {
      var inventory = snapshot.val();
      if (inventory !== null) {
        var parsedInventory = [];

        Object.keys(inventory).forEach(itemId => {
          parsedInventory.push({
            key: itemId,
            name: inventory[itemId].name,
            qty: inventory[itemId].qty,
            size: inventory[itemId].size,
            minQty: inventory[itemId].minQty,
            costPrice: inventory[itemId].costPrice,
            sellingPrice: inventory[itemId].sellingPrice
          });
        });
        dispatch(addInventories(parsedInventory));
      }
    });
  };
};

export var addInventories = inventories => {
  return { type: "ADD_INVENTORIES", inventories };
};

//Payer Actions
export var addPayers = payers => {
  return { type: "ADD_PAYERS", payers };
};

export var addPayersDates = (dates, id) => {
  return { type: "ADD_PAYERS_DATES", dates, id };
};

export var insertPayersDate = (date, termId, id) => {
  return { type: "INSERT_PAYERS_DATE", date, termId, id };
};

export var removePayersDate = (date, termId, id) => {
  return { type: "REMOVE_PAYERS_DATE", date, termId, id };
};

export var updatePayersStartDate = (startDate, id) => {
  return { type: "UPDATE_PAYERS_START_DATE", startDate, id };
};

export var resetPayers = () => {
  return { type: "RESET_PAYERS" };
};

//Registration Actions
export var addRegister = register => {
  return { type: "ADD_REGISTER", register };
};

export var resetRegister = () => {
  return { type: "RESET_REGISTER" };
};

export var updateChildName = (childName, id) => {
  return { type: "UPDATE_CHILDNAME", childName, id };
};

export var updateGender = (gender, id) => {
  return { type: "UPDATE_GENDER", gender, id };
};

export var updateDateOfBirth = (dob, id) => {
  return { type: "UPDATE_DATE_OF_BIRTH", dob, id };
};

export var updateMedical = (mc, id) => {
  return { type: "UPDATE_MEDICAL", mc, id };
};

export var updateRegister = trial => {
  return { type: "UPDATE_REGISTER", trial };
};

export var updateCentreId = (venueId, id) => {
  return { type: "UPDATE_CENTREID", venueId, id };
};

export var updateDateOfTrial = (dateOfTrial, id) => {
  return { type: "UPDATE_DATE_OF_TRIAL", dateOfTrial, id };
};

export var updateStartDate = (startDate, id) => {
  return { type: "UPDATE_START_DATE", startDate, id };
};

export var updateClassTimeDay = (time, day, id) => {
  return { type: "UPDATE_TIME_DAY", time, day, id };
};

export var updateJoining = (notJoining, id) => {
  return {
    type: "UPDATE_JOINING",
    notJoining: notJoining ? false : true,
    id
  };
};

export var addSessionDates = (dates, id) => {
  return { type: "ADD_SESSION_DATES", dates, id };
};

export var insertSessionDate = (date, termId, id) => {
  return { type: "INSERT_SESSION_DATE", date, termId, id };
};

export var removeSessionDate = (date, termId, id) => {
  return { type: "REMOVE_SESSION_DATE", date, termId, id };
};

//Parent Actions
export var addParent = parent => {
  return { type: "ADD_PARENT", parent };
};

export var resetParent = () => {
  return { type: "RESET_PARENT" };
};

export var updateParentDetails = parentDetails => {
  return { type: "UPDATE_PARENT_DETAILS", parentDetails };
};
export var updateParentName = name => {
  return { type: "UPDATE_PARENT_NAME", name };
};

export var updateContact = contact => {
  return { type: "UPDATE_CONTACT", contact };
};

export var updateEmail = email => {
  return { type: "UPDATE_EMAIL", email };
};

export var updateAddress = address => {
  return { type: "UPDATE_ADDRESS", address };
};

export var updatePostalCode = postalCode => {
  return { type: "UPDATE_POSTAL_CODE", postalCode };
};

export var updateTC = tc => {
  return {
    type: "UPDATE_TC",
    tc: tc ? false : true
  };
};

//Notes
export var startNotes = () => {
  return dispatch => {
    var notesRef = firebaseRef.child("notes");
    notesRef.once("value").then(snapshot => {
      var notes = snapshot.val();
      var parsedNotes = {};
      if (notes !== null) {
        Object.keys(notes).map(key => {
          parsedNotes[key] = {
            key,
            ...notes[key]
          };
        });
        dispatch(addNotes(parsedNotes));
      }
    });
  };
};

export var addNotes = notes => {
  return { type: "ADD_NOTES", notes };
};

export var addNote = note => {
  var notesRef = firebaseRef.child("notes");
  var newKey = notesRef.push().key;
  var updates = {};
  updates[newKey] = note;
  notesRef.update(updates);
  note.key = newKey;
  return { type: "ADD_NOTE", note };
};

export var noteArchive = (key, email, name) => {
  return dispatch => {
    var notesRef = firebaseRef.child("notes/" + key);
    notesRef.once("value").then(snapshot => {
      var notes = snapshot.val();
      var updates = {};
      if (notes.completed) {
        updates = {
          completed: null,
          completedEmail: null,
          completedName: null,
          completedDate: null
        };
      } else {
        updates = {
          completed: true,
          completedEmail: email,
          completedName: name,
          completedDate: moment().format("YYYY-MM-DD")
        };
      }
      notesRef.update(updates);
      dispatch(toggleArchive(updates, key));
    });
  };
};

export var toggleArchive = (updates, key) => {
  return { type: "NOTE_ARCHIVE", updates, key };
};

export var deleteNote = key => {
  var notesRef = firebaseRef.child("notes/" + key);
  notesRef.remove();
  return { type: "REMOVE_NOTE", key };
};

//Make Up Actions

export var startMakeUps = () => {
  return dispatch => {
    var makeUpsRef = firebaseRef.child("makeUps");
    makeUpsRef.once("value").then(snapshot => {
      var makeUps = snapshot.val();
      if (makeUps !== null) {
        var parsedMakeUps = [];

        Object.keys(makeUps).forEach(makeUpId => {
          parsedMakeUps.push({
            key: makeUpId,
            ...makeUps[makeUpId]
          });
        });
        dispatch(addMakeUps(parsedMakeUps));
      }
    });
  };
};

export var addMakeUps = makeUps => {
  return { type: "ADD_MAKEUPS", makeUps };
};

export var deleteMakeUp = key => {
  var makeUpRef = firebaseRef.child("makeUps/" + key);
  makeUpRef.remove();
  return { type: "REMOVE_MAKEUP", key };
};

export var addMakeUp = makeUp => {
  var makeUpRef = firebaseRef.child("makeUps");
  var newKey = makeUpRef.push().key;
  var updates = {};
  updates[newKey] = makeUp;
  makeUpRef.update(updates);
  makeUp.key = newKey;
  return { type: "ADD_MAKEUP", makeUp };
};

//PromotionsApp
export const startPromotions = () => {
  return dispatch => {
    const promoRef = firebaseRef.child("promotions");
    promoRef.once("value").then(snapshot => {
      const promotions = snapshot.val();
      let parsedPromo = {};
      if (promotions !== null) {
        Object.keys(promotions).map(key => {
          parsedPromo[key] = {
            key,
            ...promotions[key]
          };
        });
        dispatch(addPromotions(parsedPromo));
      }
    });
  };
};

export const addPromotions = promotions => {
  return { type: "ADD_PROMOTIONS", promotions };
};

export var addPromotion = promotion => {
  var promoRef = firebaseRef.child("promotions");
  var newKey = promoRef.push().key;
  var updates = {};
  updates[newKey] = promotion;
  promoRef.update(updates);
  promotion.key = newKey;
  return { type: "ADD_PROMOTION", promotion };
};

//Selected promotion
export var addSelectedPromotion = (promoKey, payerKey) => {
  return { type: "ADD_SELECTED_PROMOTION", promoKey, payerKey };
};

export var resetSelectedPromotion = () => {
  return { type: "RESET_SELECTED_PROMOTION" };
};

//Cancel Class
export const startCancelled = () => {
  return dispatch => {
    const cancelRef = firebaseRef.child("cancelled");
    cancelRef.once("value").then(snapshot => {
      const cancelled = snapshot.val();
      let parsedCancelled = {};
      if (cancelled !== null) {
        Object.keys(cancelled).map(key => {
          parsedCancelled[key] = {
            key,
            ...cancelled[key]
          };
        });
        dispatch(addCancelled(parsedCancelled));
      }
    });
  };
};

export const addCancelled = cancelled => {
  return { type: "ADD_CANCELLED", cancelled };
};
export var addCancelledClass = classDetails => {
  var cancelRef = firebaseRef.child("cancelled");
  var newKey = cancelRef.push().key;
  var updates = {};
  updates[newKey] = classDetails;
  cancelRef.update(updates);
  classDetails.key = newKey;
  return { type: "ADD_CANCELLED_CLASS", classDetails };
};

//credit
export const startCredits = () => {
  return dispatch => {
    const creditRef = firebaseRef.child("credits");
    creditRef.once("value").then(snapshot => {
      const credits = snapshot.val();
      let parsedCredits = {};
      if (credits !== null) {
        Object.keys(credits).map(key => {
          parsedCredits[key] = {
            key,
            ...credits[key]
          };
        });
        dispatch(addCredits(parsedCredits));
      }
    });
  };
};

export const addCredits = credits => {
  return { type: "ADD_CREDITS", credits };
};

export var addStudentCredit = creditDetails => {
  var creditRef = firebaseRef.child("credits");
  var newKey = creditRef.push().key;
  var updates = {};
  updates[newKey] = creditDetails;
  creditRef.update(updates);
  creditDetails.key = newKey;
  return { type: "ADD_STUDENT_CREDIT", creditDetails };
};

export var useStudentCredit = credit => {
  var creditRef = firebaseRef.child("credits");
  var updates = {};
  updates[credit.key] = credit;
  creditRef.update(updates);
  return { type: "USE_STUDENT_CREDIT", credit };
};
export var updateCredit = credit => {
  var creditRef = firebaseRef.child("credits");
  var updates = {};
  updates[credit.key] = credit;
  creditRef.update(updates);
  return { type: "UPDATE_CREDIT", credit };
};

export var removeCredit = key => {
  var creditsRef = firebaseRef.child("credits/" + key);
  creditsRef.remove();
  return { type: "REMOVE_CREDITS", key };
};

//Actions for Classes
export var startClasses = () => {
  return dispatch => {
    var classesRef = firebaseRef.child("classes");
    classesRef.once("value").then(snapshot => {
      var classes = snapshot.val();
      var parsedClasses = {};

      Object.keys(classes).forEach(classId => {
        parsedClasses[classId] = {
          key: classId,
          ...classes[classId]
        };
      });
      dispatch(addClasses(parsedClasses));
    });
  };
};

export const addClasses = classes => {
  return { type: "ADD_CLASSES", classes };
};

//Expense
export const startExpenses = () => {
  return dispatch => {
    const expenseRef = firebaseRef.child("expenses");
    expenseRef.once("value").then(snapshot => {
      const expenses = snapshot.val();
      let parsedExpenses = {};
      if (expenses !== null) {
        Object.keys(expenses).map(key => {
          parsedExpenses[key] = {
            key,
            ...expenses[key]
          };
        });
        dispatch(addExpenses(parsedExpenses));
      }
    });
  };
};

export const addExpenses = expenses => {
  return { type: "ADD_EXPENSES", expenses };
};

export var addExpense = expense => {
  var expensesRef = firebaseRef.child("expenses");
  var newKey = expensesRef.push().key;
  var updates = {};
  updates[newKey] = expense;
  expensesRef.update(updates);
  expense.key = newKey;
  return { type: "ADD_EXPENSE", expense };
};

export var deleteExpense = key => {
  var expensesRef = firebaseRef.child("expenses/" + key);
  expensesRef.remove();
  return { type: "REMOVE_EXPENSE", key };
};

//Expense
export const startExpensesTable = () => {
  return dispatch => {
    const expenseTableRef = firebaseRef.child("expensesTable");
    expenseTableRef.once("value").then(snapshot => {
      const expensesTable = snapshot.val();
      let parsedExpensesTable = {};
      if (expensesTable !== null) {
        Object.keys(expensesTable).map(key => {
          parsedExpensesTable[key] = {
            key,
            ...expensesTable[key]
          };
        });
        dispatch(addExpensesTable(parsedExpensesTable));
      }
    });
  };
};

export const addExpensesTable = expensesTable => {
  return { type: "ADD_EXPENSESTABLE", expensesTable };
};

export var addExpenseTable = expenseTable => {
  var expensesTableRef = firebaseRef.child("expensesTable");
  var newKey = expensesTableRef.push().key;
  var updates = {};
  updates[newKey] = expenseTable;
  expensesTableRef.update(updates);
  expenseTable.key = newKey;
  return { type: "ADD_EXPENSETABLE", expenseTable };
};

export var updateExpenseTable = (expenseTable, key) => {
  var expensesTableRef = firebaseRef.child("expensesTable");
  var updates = {};
  updates[key] = expenseTable;
  expensesTableRef.update(updates);
  return { type: "UPDATE_EXPENSETABLE", expenseTable, key };
};
