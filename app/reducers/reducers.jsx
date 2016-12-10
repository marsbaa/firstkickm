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
      case 'SAVE_TERM':
        return state.map((centre) => {
          if ((centre.id) === action.centre.key) {
            return {
             ...centre,
             ...action.centre
           };
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
    default:
      return state;
  }
}
