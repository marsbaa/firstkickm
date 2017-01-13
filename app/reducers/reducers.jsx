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
    case 'ADD_TERM':
    return state.map((centre) => {
      if ((centre.key) === action.centreKey) {
        if (centre.calendars === undefined) {
          centre= {...centre, calendars: []};

        }
        centre.calendars[action.termKey] = {
          name: action.termName,
          term: action.terms
        };
        return centre;
      }
      else {
        return centre;
      }
    });
    case 'UPDATE_TERM':
    return state.map((centre) => {
      if ((centre.key) === action.centreKey) {
        centre.calendars[action.calendarKey] = {
          name: action.termName,
          term: action.terms
        };
        return centre;
      }
      else {
        return centre;
      }
    });
    case 'DELETE_TERM':
    return state.map((centre) => {
      if ((centre.key) === action.centreKey) {
        centre.calendars = _.omit(centre.calendars, action.calendarKey);
        return centre;
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
        centre.classes.push({...action.cla});
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
