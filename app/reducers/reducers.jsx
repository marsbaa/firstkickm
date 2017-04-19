import moment from 'moment'
import _ from 'lodash'

export var authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
          uid: action.uid,
          email : action.email
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

export var usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_USERS':
      return [
        ...action.users
      ];
    case 'ADD_USER' :
      var user = action.user
      return [
        ...state,
        {
          key: user.key,
          name: user.name,
          email: user.email,
          assignedCentres: user.assignedCentres,
          assignedRoles : user.assignedRoles
        }
      ];
      case 'UPDATE_USER' :
        return state.map((user) => {
          if (user.key === action.userId) {
            return {
              ...user,
              name: action.user.name,
              email: action.user.email,
              assignedCentres: action.user.assignedCentres,
              assignedRoles: action.user.assignedRoles
            }
          }
          else {
            return user
          }
        })
      default:
        return state;
    }
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
    case 'UPDATE_TRIAL_REGISTRATION':
      return state.map((trial) => {
        if (trial.id === action.trialId) {
          return {
            ...trial,
            registered : true,
            dateRegistered : moment().format('YYYY-MM-DD')
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

export var paymentReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PAYMENT':
      var payment = action.paymentDetails
      return [
        ...state,
        action.paymentDetails
      ];
    case 'ADD_PAYMENTS':
      return [
        ...action.payments
      ]
    case 'ISSUE_JERSEY':
      return state.map((payment)=> {
        if (payment.key === action.payment.key) {
          return {
            ...action.payment
          }
        }
        else {
          return payment
        }
      })
    default:
      return state;
    }
}

export var studentReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_STUDENTS':
      return [
        ...state,
        ...action.students
      ];
    case 'ADD_STUDENT':
      return [
        ...state,
        {...action.student}
      ];
    case 'UPDATE_STUDENT':
      return state.map((student) => {
        if ((student.key) === action.studentId) {
          return {
           ...student,
           ...action.student
         };
        }
        else {
          return student;
        }
      });
    case 'ADD_STUDENT_PAYMENT':
      return state.map((student) => {
        if (student.key === action.paymentDetails.childKey) {
          if (student.payments === undefined) {
            return {
             ...student,
             payments : {
               [action.key] : {
                  date: action.paymentDetails.date,
                  paymentKey: action.paymentDetails.key,
                  termsPaid : action.paymentDetails.termsPaid,
                  total : action.paymentDetails.total
               }
             }

            }
          }
          else {
            var payments = student.payments
            return {
             ...student,
             payments : {
               ...payments,
               [action.key] : {
                  date: action.paymentDetails.date,
                  paymentKey: action.paymentDetails.key,
                  termsPaid : action.paymentDetails.termsPaid,
                  total : action.paymentDetails.total
               }
             }

            }
          }

         }
        else {
          return student;
        }
      });
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
          var attendance = student.attendance
          if (student.attendance[action.date] === undefined){
            return {
              ...student,
              attendance: {
                ...attendance,
                [action.date] : {
                  attended: true
                }
              }
            }
          }
          else {
            return {
              ...student,
              attendance: {
                ...attendance,
                [action.date] : {
                  attended: student.attendance[action.date].attended === true ? false:true
                }
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
    case 'DELETE_COACH':
      return state.filter((coach) => {
        return coach.key !== action.coachId;
      });
    case 'TOGGLE_COACH_ATTENDANCE':
      return state.map((coach) => {
        if (coach.key === action.id) {
          if (coach.attendance === undefined) {
            return {
              ...coach,
              attendance: {
                [action.date] : {
                  attended: true,
                  classId: action.classId,
                  sessionRate: action.sessionRate
                }
              }
            };
          }

        else {
            var attendance = coach.attendance
            if (coach.attendance[action.date] === undefined){
              return {
                ...coach,
                attendance: {
                  ...attendance,
                  [action.date] : {
                    attended: true,
                    classId: action.classId,
                    sessionRate: action.sessionRate
                  }
                }
              };
            }
            else {
              return {
                ...coach,
                attendance: {
                  ...attendance,
                  [action.date] : {
                    attended: coach.attendance[action.date].attended === true ? false:true,
                    classId: action.classId,
                    sessionRate: action.sessionRate
                  }
                }
              }
            }

          }
        }
        else {
          return coach;
        }
      })
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

export var coachScheduleReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_COACHSCHEDULE':
      return [
        ...action.coachSchedule
      ];
    case 'TOGGLE_SCHEDULE':
      var scheduleKey = action.classKey+action.date;
        if (_.findIndex(state, { scheduleKey : scheduleKey}) === -1) {
            return [
              ...state,
              {
                scheduleKey,
                classKey: action.classKey,
                date: action.date,
                assigned: action.val
              }
            ]
        }
        else {
          return state.map((schedule) => {
            if (schedule.scheduleKey === scheduleKey) {
              return {
                scheduleKey,
                classKey: action.classKey,
                date: action.date,
                assigned: action.val
              }
            }
            else {
              return schedule
            }
          })
        }


    default:
      return state;
}
};

export var selectionReducer = (state={id: '0'}, action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_CENTRE':
      return {
        ...action.centre
      }
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

export var inventoryReducer = (state=[], action) => {
  switch(action.type) {
    case 'ADD_INVENTORIES':
      return [
        ...state,
        ...action.inventories
      ];
    default:
      return state;
  }
}


export var registrationReducer = (state=[], action) => {
  switch(action.type) {
    case 'ADD_REGISTER':
      return [
        ...action.payers
      ];
    case 'UPDATE_REGISTER':
      return state.map((register) => {
        if (register.id === action.trial.id) {
          return {
            ...register,
            childName: action.trial.childName,
            gender: action.trial.gender,
            dateOfBirth: action.trial.dateOfBirth,
            dateOfTrial: action.trial.dateOfTrial,
            venueId: action.trial.venueId,
            currentClassTime: action.trial.currentClassTime,
            currentClassDay: action.trial.currentClassDay,
            medicalCondition: action.trial.medicalCondition
          }
        }
        else {
          return register;
        }
      });
      case 'UPDATE_JOINING':
        return state.map((register) => {
          if (register.id === action.id) {
            return {
              ...register,
              joining : register.joining === true ? false : true
            }
          }
          else {
            return register;
          }
        });
        case 'UPDATE_PARENT':
          return state.map((register) => {
              return {
                ...register,
                parentName: action.parentDetails.parentName,
                contactNumber: action.parentDetails.contactNumber,
                email: action.parentDetails.email,
                address: action.parentDetails.address,
                postalcode: action.parentDetails.postalcode
              }
            })
    default:
      return state;
    }
  }

  export var fetchingReducer = (state={completed: false}, action) => {
    switch(action.type) {
      case 'IS_FETCHING':
        return {completed: true}
      default:
        return state;
    }
  }
