import moment from 'moment';
import React from 'react';
import _ from 'lodash';

export function findPaymentDetails(students, termDates, selectedTerm) {
  var paid = [];
  var unpaid = [];
  var paidDetails = [];
  var paidAmount = 0;

  Object.keys(students).map(studentId => {
    var student = students[studentId];
    var attended = false;
    var p = false;

    //Check if payment is made for this term
    var payment = _.find(student.payments, o => {
      if (o.termsPaid !== undefined) {
        return o.termsPaid[selectedTerm] !== undefined;
      }
      return false;
    });

    if (payment !== undefined) {
      paid.push(student);
      paidDetails.push(payment);
      paidAmount += parseInt(payment.total);
      p = true;
    }

    //Check if student attends term
    termDates.map(date => {
      var dateId = moment(date).format('YYYY-MM-DD');
      if (student.attendance !== undefined) {
        if (student.attendance[dateId] !== undefined) {
          if (student.attendance[dateId].attended) {
            attended = true;
          }
        }
      }

      if (payment !== undefined) {
        if (
          _.find(payment.termsPaid[selectedTerm], o => {
            return moment(o.date).isSame(dateId, 'day');
          }) !== undefined
        ) {
          p = true;
        }
      }
    });
    //If attended and not paid
    if (attended && !p) {
      unpaid.push(student);
    }
  });
  return {
    paid,
    paidAmount,
    paidDetails,
    unpaid
  };
}

export function classToday(calendars, centreKey, selectedDate) {
  var today = false;
  Object.keys(calendars).map(calendarKey => {
    var calendar = calendars[calendarKey];
    if (calendar.centreKey === centreKey) {
      Object.keys(calendar.terms).map(termId => {
        var term = calendar.terms[termId];
        term.map(date => {
          if (moment(date).isSame(selectedDate, 'day')) {
            today = true;
          }
        });
      });
    }
  });
  return today;
}

export function getTerm(calendars, centreKey, date) {
  var t = 1;
  Object.keys(calendars).map(calendarKey => {
    var calendar = calendars[calendarKey];
    if (calendar.centreKey === centreKey) {
      var terms = calendar.terms;
      Object.keys(terms).map(id => {
        var term = terms[id];
        if (
          moment(date).isBetween(term[0], term[term.length - 1], null, '[]')
        ) {
          t = parseInt(id);
        } else if (moment(date).isAfter(term[term.length - 1])) {
          t = parseInt(id) + 1;
        }
      });
    }
  });
  return t;
}

export function getCalendarKey(student, classes, ageGroup) {
  var key = '';
  var studentAgeGroup = '';
  var currentClassDay, currentClassTime;
  if (student.ageGroup === undefined) {
    studentAgeGroup = ageGroup;
    currentClassDay = moment(student.dateOfTrial).format('dddd');
    currentClassTime = student.timeOfTrial;
  } else {
    studentAgeGroup = student.ageGroup;
    currentClassDay = student.currentClassDay;
    currentClassTime = student.currentClassTime;
  }

  Object.keys(classes).forEach(classId => {
    var { ageGroup, day, startTime, endTime, calendarKey } = classes[classId];
    if (ageGroup === studentAgeGroup) {
      if (day === currentClassDay) {
        var classTime = startTime + ' - ' + endTime;
        if (classTime === currentClassTime) {
          key = calendarKey;
        }
      }
    }
  });
  return key;
}

export function getCalendarDates(calendar) {
  var calendarDates = [];
  Object.keys(calendar.terms).map(termId => {
    var term = calendar.terms[termId];
    term.map(date => {
      calendarDates.push(moment(date));
    });
  });
  return calendarDates;
}

export function isManager(auth, users) {
  var user = _.find(users, ['email', auth.email]);
  if (user !== undefined) {
    if (user.assignedRoles === 'Manager') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function getActive(students) {
  return _.filter(students, o => {
    return !(o.status === 'Not Active');
  });
}

export function getNotActive(students) {
  return _.filter(students, o => {
    return o.status === 'Not Active';
  });
}

export function getCentreCalendarDates(calendars, centreKey) {
  var termDates = [];
  Object.keys(calendars).map(calendarKey => {
    var calendar = calendars[calendarKey];
    if (calendar.centreKey === centreKey) {
      Object.keys(calendar.terms).map(termId => {
        var term = calendar.terms[termId];
        term.map(date => {
          date = moment(date).format('YYYYMMDD');
          termDates.push(moment(date));
        });
      });
    }
  });
  return termDates;
}

export function getCentreCalendarDatesAfter(calendars, centreKey) {
  var termDates = [];
  Object.keys(calendars).map(calendarKey => {
    var calendar = calendars[calendarKey];
    if (calendar.centreKey === centreKey) {
      Object.keys(calendar.terms).map(termId => {
        var term = calendar.terms[termId];
        term.map(date => {
          date = moment(date).format('YYYYMMDD');
          if (moment(date).isSameOrAfter()) {
            termDates.push(moment(date));
          }
        });
      });
    }
  });
  return termDates;
}

export function sortByEndTime(classes) {
  return _.orderBy(classes, o => {
    var endTime = o.endTime.split(':');
    if (endTime[1] === undefined) {
      endTime = o.endTime.split('.');
    }
    if (endTime[1].endsWith('pm')) {
      endTime[0] = endTime[0] + 12;
    }
    endTime = endTime[0] + ':' + endTime[1];
    return endTime;
  });
}

export function filterByAMPM(classes) {
  return _.filter(classes, o => {
    var startTime = o.startTime.split(':');
    if (startTime[1].endsWith(this.state.filter)) {
      return true;
    } else {
      false;
    }
  });
}

export function attendedDate(attendance, date) {
  if (attendance !== undefined) {
    if (attendance[date] !== undefined) {
      return attendance[date].attended;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function paidDate(payments, date, term) {
  var payment = _.find(payments, o => {
    if (o.termsPaid !== undefined) {
      return o.termsPaid[term] !== undefined;
    }
    return false;
  });
  if (payment !== undefined) {
    if (
      _.find(payment.termsPaid[term], o => {
        if (moment(o.date).isSame(date, 'day')) {
          return true;
        } else {
          return false;
        }
      }) !== undefined
    ) {
      return true;
    }
  } else {
    return false;
  }
}

export function countAttended(group, date) {
  var attended = 0;
  Object.keys(group).forEach(studentId => {
    if (group[studentId].attendance !== undefined) {
      if (
        group[studentId].attendance[moment(date).format('YYYY-MM-DD')] !==
        undefined
      ) {
        if (
          group[studentId].attendance[moment(date).format('YYYY-MM-DD')]
            .attended
        ) {
          attended = attended + 1;
        }
      }
    }
  });
  return attended;
}

export function getAgeGroup(ageGroup, dob) {
  var now = moment();
  var dateofbirth = moment(JSON.stringify(dob), 'YYYY-MM-DD');
  var age = now.diff(dateofbirth, 'years');
  var childAgeGroup;
  ageGroup.map(group => {
    if (age >= group.minAge && age <= group.maxAge) {
      childAgeGroup = group.name;
      if (childAgeGroup === 'U8B') {
        childAgeGroup = 'U8';
      }
    }
  });
  return childAgeGroup;
}

export function getCentreKey(centres, venueId) {
  return _.find(centres, { id: venueId }).key;
}

export function getAllTermId(calendars, centreKey) {
  var termIds = [];
  Object.keys(calendars).map(calendarKey => {
    var calendar = calendars[calendarKey];
    if (calendar.centreKey === centreKey) {
      var terms = calendar.terms;
      Object.keys(terms).map(id => {
        if (_.indexOf(termIds, id) === -1) {
          termIds.push(id);
        }
      });
    }
  });
  termIds = termIds.sort();
  return termIds;
}
