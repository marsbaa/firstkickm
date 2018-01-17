import moment from "moment";
import _ from "lodash";

export var authReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        uid: action.uid,
        email: action.email,
        loggedIn: true
      };
    case "LOGOUT":
      return {};
    default:
      return state;
  }
};

export var redirectReducer = (state = "", action) => {
  switch (action.type) {
    case "REDIRECT_URL":
      return action.url;
    default:
      return state;
  }
};

export var navbarReducer = (state = { link: "", title: "" }, action) => {
  switch (action.type) {
    case "UPDATE_NAV_TITLE":
      return {
        link: action.link,
        title: action.title
      };
    default:
      return state;
  }
};

export var usersReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_USERS":
      return [...action.users];
    case "ADD_USER":
      var user = action.user;
      return [
        ...state,
        {
          key: user.key,
          name: user.name,
          email: user.email,
          assignedCentres: user.assignedCentres,
          assignedRoles: user.assignedRoles
        }
      ];
    case "UPDATE_USER":
      return state.map(user => {
        if (user.key === action.userId) {
          return {
            ...user,
            name: action.user.name,
            email: action.user.email,
            assignedCentres: action.user.assignedCentres,
            assignedRoles: action.user.assignedRoles
          };
        } else {
          return user;
        }
      });
    default:
      return state;
  }
};

export var trialsReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TRIALS":
      return [...state, ...action.trials];
    case "ADD_TRIAL":
      return [...state, action.trial];
    case "UPDATE_TRIAL":
      return state.map(trial => {
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
    case "UPDATE_TRIAL_REGISTRATION":
      return state.map(trial => {
        if (trial.id === action.trialId) {
          return {
            ...trial,
            registered: true,
            dateRegistered: moment().format("YYYY-MM-DD")
          };
        } else {
          return trial;
        }
      });
    case "TOGGLE_TRIAL":
      return state.map(trial => {
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
    case "ADD_DEPOSIT":
      return state.map(trial => {
        if (trial.id === action.id) {
          return {
            ...trial,
            deposit: action.deposit,
            depositCollected: action.date,
            depositCleared: false
          };
        } else {
          return trial;
        }
      });
    default:
      return state;
  }
};

export var openhouseReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_OPENHOUSE":
      return [...action.openhouse];
    case "UPDATE_OPENHOUSE":
      return state.map(openhouse => {
        if (openhouse.key === action.trial.key) {
          return {
            ...openhouse,
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
          return openhouse;
        }
      });
    case "UPDATE_OPENHOUSE_REGISTRATION":
      return state.map(openhouse => {
        if (openhouse.key === action.key) {
          return {
            ...openhouse,
            registered: true,
            dateRegistered: moment().format("YYYY-MM-DD")
          };
        } else {
          return openhouse;
        }
      });
    case "TOGGLE_OPENHOUSE":
      return state.map(openhouse => {
        if (openhouse.key === action.key) {
          var nextAttended = !openhouse.attended;

          return {
            ...openhouse,
            attended: nextAttended,
            attendedOn: moment().unix()
          };
        } else {
          return openhouse;
        }
      });
    case "ADD_OH_DEPOSIT":
      return state.map(openhouse => {
        if (openhouse.key === action.key) {
          return {
            ...openhouse,
            deposit: action.deposit,
            depositCollected: action.date,
            depositCleared: false
          };
        } else {
          return openhouse;
        }
      });
    default:
      return state;
  }
};

export var paymentReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_PAYMENT":
      var payment = action.paymentDetails;
      return [...state, action.paymentDetails];
    case "REMOVE_PAYMENT":
      return state.filter(({ key }) => key !== action.paymentKey);
    case "ADD_PAYMENTS":
      return [...action.payments];
    case "ISSUE_JERSEY":
      return state.map(payment => {
        if (payment.key === action.payment.key) {
          return {
            ...action.payment
          };
        } else {
          return payment;
        }
      });
    default:
      return state;
  }
};

export var studentReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_STUDENTS":
      return [...state, ...action.students];
    case "ADD_STUDENT":
      return [...state, { ...action.student }];
    case "DELETE_STUDENT":
      return state.filter(student => {
        return student.key !== action.key;
      });
    case "UPDATE_STUDENT":
      return state.map(student => {
        if (student.key === action.studentId) {
          return {
            ...student,
            ...action.student
          };
        } else {
          return student;
        }
      });
    case "REMOVE_STUDENT_PAYMENT":
      return state.map(student => {
        if (student.key === action.childKey) {
          var id = Object.keys(student.payments).map(id => {
            if (student.payments[id].paymentKey === action.paymentKey) {
              return id;
            }
          });
          student.payments = _.omit(student.payments, id);
          if (_.isEmpty(student.payments)) {
            student.payments = undefined;
          }
          return {
            ...student
          };
        } else {
          return student;
        }
      });
    case "ADD_STUDENT_PAYMENT":
      return state.map(student => {
        if (student.key === action.paymentDetails.childKey) {
          if (student.payments === undefined) {
            return {
              ...student,
              payments: {
                [action.key]: {
                  date: action.paymentDetails.date,
                  paymentKey: action.paymentDetails.key,
                  termsPaid: action.paymentDetails.termsPaid,
                  total: action.paymentDetails.total
                }
              }
            };
          } else {
            var payments = student.payments;
            return {
              ...student,
              payments: {
                ...payments,
                [action.key]: {
                  date: action.paymentDetails.date,
                  paymentKey: action.paymentDetails.key,
                  termsPaid: action.paymentDetails.termsPaid,
                  total: action.paymentDetails.total
                }
              }
            };
          }
        } else {
          return student;
        }
      });
    case "TOGGLE_ATTENDANCE":
      return state.map(student => {
        if (student.key === action.id) {
          if (student.attendance === undefined) {
            return {
              ...student,
              attendance: {
                [action.date]: {
                  attended: true
                }
              }
            };
          } else if (student.attendance[action.date] === undefined) {
            var attendance = student.attendance;
            return {
              ...student,
              attendance: {
                ...attendance,
                [action.date]: {
                  attended: true
                }
              }
            };
          } else {
            var attendance = student.attendance;
            return {
              ...student,
              attendance: {
                ...attendance,
                [action.date]: {
                  attended: attendance[action.date].attended ? false : true
                }
              }
            };
          }
        } else {
          return student;
        }
      });
    default:
      return state;
  }
};

export var coachReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_COACHES":
      return action.coaches;
    case "ADD_COACH":
      return [...state, { ...action.coach }];
    case "UPDATE_COACH":
      return state.map(coach => {
        if (coach.key === action.coachId) {
          return {
            ...coach,
            ...action.coach
          };
        } else {
          return coach;
        }
      });
    case "DELETE_COACH":
      return state.filter(coach => {
        return coach.key !== action.coachId;
      });
    case "TOGGLE_COACH_ATTENDANCE":
      return state.map(coach => {
        if (coach.key === action.id) {
          if (coach.attendance === undefined) {
            return {
              ...coach,
              attendance: {
                [action.date]: {
                  attended: true,
                  classId: action.classId,
                  sessionRate: action.sessionRate
                }
              }
            };
          } else {
            var attendance = coach.attendance;
            if (coach.attendance[action.date] === undefined) {
              return {
                ...coach,
                attendance: {
                  ...attendance,
                  [action.date]: {
                    attended: true,
                    classId: action.classId,
                    sessionRate: action.sessionRate
                  }
                }
              };
            } else {
              return {
                ...coach,
                attendance: {
                  ...attendance,
                  [action.date]: {
                    attended:
                      coach.attendance[action.date].attended === true
                        ? false
                        : true,
                    classId: action.classId,
                    sessionRate: action.sessionRate
                  }
                }
              };
            }
          }
        } else {
          return coach;
        }
      });
    default:
      return state;
  }
};

export var adminReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_ADMINS":
      return action.admins;

    case "ADD_ADMIN":
      return {
        ...state,
        [action.admin.key]: { ...action.admin }
      };
    case "UPDATE_ADMIN":
      return {
        ...state,
        [action.admin.key]: { ...action.admin }
      };
    case "DELETE_ADMIN":
      return state.filter(admin => {
        return admin.key !== action.adminId;
      });
    default:
      return state;
  }
};

export var centreReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CENTRES":
      return { ...action.centres };
    case "ADD_CENTRE":
      return {
        ...state,
        [action.centre.key]: {
          ...action.centre
        }
      };
    case "UPDATE_CENTRE":
      return {
        ...state,
        [action.centre.key]: {
          ...action.centre
        }
      };

    case "ADD_CLASS":
      var centre = state[action.centreKey];
      if (centre.classes === undefined) {
        centre = { ...centre, classes: [] };
      }
      return {
        ...state,
        [action.centreKey]: {
          classes: {
            [action.cla.key]: {
              ...action.cla
            }
          }
        }
      };

    default:
      return state;
  }
};

export var calendarReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CALENDARS":
      return action.calendars;
    case "ADD_TERM":
      return {
        ...state,
        [action.calendarKey]: { ...action.calendar }
      };
    case "UPDATE_TERM":
      return {
        ...state,
        [action.calendarKey]: {
          ...action.calendar,
          key: action.calendarKey
        }
      };
    case "DELETE_TERM":
      return _.omit(state, [action.calendarKey]);
    default:
      return state;
  }
};

export var coachScheduleReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_COACHSCHEDULE":
      return [...action.coachSchedule];
    case "TOGGLE_SCHEDULE":
      var scheduleKey = action.classKey + action.date;
      if (_.findIndex(state, { scheduleKey: scheduleKey }) === -1) {
        return [
          ...state,
          {
            scheduleKey,
            classKey: action.classKey,
            date: action.date,
            assigned: action.val
          }
        ];
      } else {
        return state.map(schedule => {
          if (schedule.scheduleKey === scheduleKey) {
            return {
              scheduleKey,
              classKey: action.classKey,
              date: action.date,
              assigned: action.val
            };
          } else {
            return schedule;
          }
        });
      }

    default:
      return state;
  }
};

export var selectionReducer = (state = { id: "0" }, action) => {
  switch (action.type) {
    case "UPDATE_SELECTED_CENTRE":
      return {
        ...action.centre
      };
    default:
      return state;
  }
};

export var searchTextReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_SEARCH_TEXT":
      return action.searchText;
    default:
      return state;
  }
};

export var termReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_TERM_SELECTED_DAYS":
      return {
        ...state,
        [action.year]: {
          ...state[action.year],
          [action.id]: action.selectedDays
        }
      };
    case "START_TERMS":
      return action.terms;
    case "RESET_TERMS":
      return {};
    default:
      return state;
  }
};

export var ageGroupReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_AGE_GROUPS":
      return [...state, ...action.ageGroups];
    case "ADD_AGE_GROUP":
      return [...state, { ...action.ageGroup }];
    case "RESET_AGE_GROUP":
      return [];
    case "UPDATE_AGE_GROUP":
      return state.map(ageGroup => {
        if (ageGroup.key === action.key) {
          return {
            ...ageGroup,
            ...action.ageGroup
          };
        } else {
          return ageGroup;
        }
      });
    default:
      return state;
  }
};

export var inventoryReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_INVENTORIES":
      return [...state, ...action.inventories];
    default:
      return state;
  }
};

export var selectedPromotionReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_SELECTED_PROMOTION":
      return {
        ...state,
        [action.payerKey]: {
          promoKey: action.promoKey
        }
      };
    case "RESET_SELECTED_PROMOTION":
      return {};
    default:
      return state;
  }
};

export var payerReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_PAYERS":
      return action.payers;
    case "ADD_PAYERS_DATES":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          sessionDates: { ...action.dates }
        }
      };
    case "INSERT_PAYERS_DATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          sessionDates: {
            ...state[action.id].sessionDates,
            [action.termId]: [
              ...state[action.id].sessionDates[action.termId],
              action.date
            ]
          }
        }
      };
    case "REMOVE_PAYERS_DATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          sessionDates: {
            ...state[action.id].sessionDates,
            [action.termId]: [
              ...state[action.id].sessionDates[action.termId].filter(date => {
                return date !== action.date;
              })
            ]
          }
        }
      };
    case "UPDATE_PAYERS_START_DATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          startDate: action.startDate
        }
      };
    case "RESET_PAYERS":
      return {};
    default:
      return state;
  }
};

export var registrationReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_REGISTER":
      return action.register;
    case "ADD_SESSION_DATES":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          sessionDates: { ...action.dates }
        }
      };
    case "INSERT_SESSION_DATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          sessionDates: {
            ...state[action.id].sessionDates,
            [action.termId]: [
              ...state[action.id].sessionDates[action.termId],
              action.date
            ]
          }
        }
      };
    case "REMOVE_SESSION_DATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          sessionDates: {
            ...state[action.id].sessionDates,
            [action.termId]: [
              ...state[action.id].sessionDates[action.termId].filter(date => {
                return date !== action.date;
              })
            ]
          }
        }
      };
    case "UPDATE_PARENT_DETAILS":
      return state.map(register => {
        return {
          ...register,
          parentName: action.parentDetails.parentName,
          contactNumber: action.parentDetails.contactNumber,
          email: action.parentDetails.email,
          address: action.parentDetails.address,
          postalcode: action.parentDetails.postalcode
        };
      });
    case "UPDATE_CHILDNAME":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          childName: action.childName
        }
      };
    case "UPDATE_GENDER":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          gender: action.gender
        }
      };
    case "UPDATE_DATE_OF_BIRTH":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          dateOfBirth: action.dob
        }
      };
    case "UPDATE_DATE_OF_TRIAL":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          dateOfTrial: action.dateOfTrial,
          startDate: action.dateOfTrial
        }
      };
    case "UPDATE_START_DATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          startDate: action.startDate
        }
      };
    case "UPDATE_MEDICAL":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          medicalCondition: action.mc
        }
      };
    case "UPDATE_JOINING":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          notJoining: action.notJoining
        }
      };
    case "UPDATE_CENTREID":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          venueId: action.venueId
        }
      };
    case "UPDATE_TIME_DAY":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          currentClassTime: action.time,
          currentClassDay: action.day
        }
      };

    case "RESET_REGISTER":
      return {};
    default:
      return state;
  }
};

export var parentReducer = (
  state = { address: "", postalCode: "" },
  action
) => {
  switch (action.type) {
    case "ADD_PARENT":
      return { ...state, ...action.parent };
    case "RESET_PARENT":
      return {};
    case "UPDATE_PARENT_NAME":
      return { ...state, parentName: action.name };
    case "UPDATE_CONTACT":
      return { ...state, contact: action.contact };
    case "UPDATE_EMAIL":
      return { ...state, email: action.email };
    case "UPDATE_ADDRESS":
      return { ...state, address: action.address };
    case "UPDATE_POSTAL_CODE":
      return { ...state, postalCode: action.postalCode };
    case "UPDATE_TC":
      return { ...state, tc: action.tc };
    default:
      return state;
  }
};

export var fetchingReducer = (state = { completed: false }, action) => {
  switch (action.type) {
    case "IS_FETCHING":
      return { completed: action.completed };
    default:
      return state;
  }
};

export var expenseReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_EXPENSES":
      return action.expenses;
    case "ADD_EXPENSE":
      return {
        ...state,
        [action.expense.key]: { ...action.expense }
      };
    case "REMOVE_EXPENSE":
      return _.omit(state, [action.key]);
    default:
      return state;
  }
};

export var notesReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_NOTES":
      return action.notes;
    case "ADD_NOTE":
      return {
        ...state,
        [action.note.key]: { ...action.note }
      };
    case "NOTE_ARCHIVE":
      var note = state[action.key];
      return {
        ...state,
        [action.key]: { ...note, ...action.updates }
      };
    case "REMOVE_NOTE":
      return _.omit(state, [action.key]);
    default:
      return state;
  }
};

export var makeUpReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_MAKEUPS":
      return [...state, ...action.makeUps];
    case "ADD_MAKEUP":
      return [...state, { ...action.makeUp }];
    case "REMOVE_MAKEUP":
      return state.filter(({ key }) => key !== action.key);
    default:
      return state;
  }
};

export const promotionsReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_PROMOTIONS":
      return action.promotions;
    case "ADD_PROMOTION":
      return { ...state, [action.promotion.key]: { ...action.promotion } };
    default:
      return state;
  }
};

export const cancelReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CANCELLED":
      return action.cancelled;
    case "ADD_CANCELLED_CLASS":
      return {
        ...state,
        [action.classDetails.key]: { ...action.classDetails }
      };
    default:
      return state;
  }
};

export const creditReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CREDITS":
      return action.credits;
    case "ADD_STUDENT_CREDIT":
      return {
        ...state,
        [action.creditDetails.key]: { ...action.creditDetails }
      };
    case "USE_STUDENT_CREDIT":
      return {
        ...state,
        [action.credit.key]: { ...action.credit }
      };
    case "REMOVE_CREDITS":
      return _.omit(state, [action.key]);
    default:
      return state;
  }
};

export const classesReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CLASSES":
      return action.classes;
    case "ADD_NEW_CLASS":
      return {
        ...state,
        [action.cla.key]: { ...action.cla }
      };
    case "DELETE_CLASS":
      return _.omit(state, [action.classKey]);
    default:
      return state;
  }
};
