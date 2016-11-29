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
    default:
      return state;
  }
};

export var selectionReducer = (state={}, action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_CENTRE':
      return {
        selectedCentre: action.id
      };
    default:
      return state;
  }
};
