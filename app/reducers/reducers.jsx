import moment from 'moment'

export var authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
          uid: action.uid
        };
    case 'LOGOUT':
      return {};
    default:
      return state;
  };
};

export var navbarReducer = (state = {link: '', title: ''}, action) => {
  switch (action.type) {
    case 'UPDATE_NAV_TITLE':
      return {
        link: action.link,
        title: action.title
      };
    default:
       return state;
  };
};

export var trialsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TRIALS':
      return [
        ...state,
        ...action.trials
      ];
    case 'ADD_TRIAL':
      return [
        ...state,
        action.trial
      ];
    case 'UPDATE_TRIAL':
      return state.map((trial) => {
        if (trial.id === action.trial.id) {
          return {
            ...trial,
            childName: action.trial.childName,
            contactNumber: action.trial.contactNumber,
            email: action.trial.email,
            gender: action.trial.gender,
            dateOfBirth: action.trial.dateOfBirth,
            dateOfTrial: action.trial.dateOfTrial,
            venueId: action.trial.venueId,
            timeOfTrial: action.trial.timeOfTrial,
            parentName: action.trial.parentName,
            medicalCondition: action.trial.medicalCondition
          };
        } else {
          return trial;
        }
      });
    case 'TOGGLE_TRIAL':
      return state.map((trial) => {
        if (trial.id === action.id) {
          var nextAttended = !trial.attended;

          return {
            ...trial,
            attended: nextAttended,
            attendedOn: moment().unix()
          };
        } else {
          return trial;
        }
      });
    default:
      return state;
  }
};


export var studentReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_STUDENTS':
      return [
        ...state,
        ...action.students
      ];
    case 'TOGGLE_ATTENDANCE':
      return state.map((student) => {
        if (student.key === action.id) {
          if (student.attendance === undefined) {
            return {
              ...student,
              attendance: {
                [action.date] : {
                  attended: true
                }
              }
            };
          }
        else {
            return {
              ...student,
              attendance: {
                [action.date] : {
                  attended: student.attendance[action.date].attended === true ? false:true
                }
              }
            }
          }
        }
        else {
          return student;
        }
      })
    default:
      return state;
 }
};


export var coachReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_COACHES':
      return [
        ...state,
        ...action.coaches
      ];
    case 'ADD_COACH':
      return [
        ...state,
        {...action.coach}
      ];
    case 'UPDATE_COACH':
      return state.map((coach) => {
        if ((coach.key) === action.coachId) {
          return {
           ...coach,
           ...action.coach
         };
        }
        else {
          return coach;
        }
      });
    default:
      return state;
 }
};


export var centreReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CENTRES':
      return [
        ...state,
        ...action.centres
      ];
    case 'ADD_CENTRE':
      return [
        ...state,
        {...action.centre}
      ];
    case 'UPDATE_CENTRE':
      return state.map((centre) => {
        if ((centre.id) === action.centre.id) {
          return {
           ...centre,
           ...action.centre
         };
        }
        else {
          return centre;
        }
      });

    case 'ADD_CLASS':
    return state.map((centre) => {
      if ((centre.key) === action.centreKey) {
        if (centre.classes === undefined) {
          centre= {...centre, classes: []};
        }
        centre.classes[action.cla.key] = action.cla;
        return centre;
      }
      else {
        return centre;
      }
    });
    case 'DELETE_CLASS':
    return state.map((centre) => {
      if ((centre.key) === action.centreKey) {
        centre.classes = _.omit(centre.classes, action.classKey);
        return centre;
      }
      else {
        return centre;
      }
    });

    default:
      return state;
  }
};

export var calendarReducer = (state=[], action) => {
  switch (action.type) {
    case 'ADD_CALENDARS':
      return [
        ...action.calendars
      ];
    case 'ADD_TERM':
    return [
      ...state,
      { key: action.termKey,
        centreKey: action.centreKey,
        name: action.name,
        terms: action.terms
      }
    ];
    case 'UPDATE_TERM':
    return state.map((term) => {
      if (term.key === action.termKey) {
        return {
          key: action.termKey,
          centreKey: action.centreKey,
          name: action.name,
          terms: action.terms
        }
      }
      else {
        return term;
      }
    });
    case 'DELETE_TERM':
      return state.filter((term) => {
        return term.key !== action.termKey;
      });


    default:
      return state;
  }
}

export var selectionReducer = (state='0', action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_CENTRE':
      return action.id;
    default:
      return state;
  }
};

export var searchTextReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return action.searchText;
    default:
      return state;
  };
};

export var termReducer = (state=[], action) => {
  switch (action.type) {
    case 'UPDATE_TERM_SELECTED_DAYS':
      state[action.id] = action.selectedDays;
      return state;
    case 'START_TERMS':
      return action.terms;

    case 'RESET_TERMS':
      return [];
    default:
      return state;
  }
}

export var ageGroupReducer = (state=[], action) => {
  switch(action.type) {
    case 'ADD_AGE_GROUPS':
      return [
        ...state,
        ...action.ageGroups
      ];
    case 'ADD_AGE_GROUP':
      return [
        ...state,
      {...action.ageGroup}
    ];
    case 'RESET_AGE_GROUP':
      return [];
    case 'UPDATE_AGE_GROUP':
      return state.map((ageGroup) => {
        if ((ageGroup.key) === action.key) {
          return {
           ...ageGroup,
           ...action.ageGroup
         };
        }
        else {
          return ageGroup;
        }
      });
    default:
      return state;
  }
}
