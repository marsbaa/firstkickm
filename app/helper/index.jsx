import moment from "moment";
import React from "react";
import _ from "lodash";

export function getClosestDate(termDates) {
  var today = moment();
  return _.filter(termDates, o => {
    return moment(o.date).isSameOrAfter(today, "day");
  })[0];
}

export function isDatePaid(payments, date) {
  let found = false;
  Object.keys(payments).map(paymentKey => {
    const { termsPaid } = payments[paymentKey];
    if (termsPaid !== undefined) {
      Object.keys(termsPaid).map(termId => {
        if (
          _.find(termsPaid[termId], o => {
            return moment(o.date).isSame(date, "day");
          }) !== undefined
        ) {
          found = true;
        }
      });
    }
  });
  return found;
}

export function isAttended(attendance, date) {
  let found = false;
  Object.keys(attendance).map(attendedDate => {
    const { attended } = attendance[attendedDate];
    if (attended !== undefined) {
      if (moment(attendedDate).isSame(date, "day")) {
        found = attended;
      }
    }
  });
  return found;
}

export function findPaymentDetails(students, termDates, selectedTerm, makeUps) {
  let paid = [];
  let unpaid = [];
  let paidDetails = [];
  let paidAmount = 0;

  Object.keys(students).map(studentId => {
    const student = students[studentId];
    let studentMakeUps = _.filter(makeUps, { studentKey: student.key });
    let attended = false;
    let p = false;

    //Check if payment is made for this term
    let payment = _.find(student.payments, o => {
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
      var dateId = moment(date).format("YYYY-MM-DD");
      let makeUpDate = _.find(studentMakeUps, o => {
        return moment(o.toDate).isSame(date, "day");
      });
      if (student.attendance !== undefined) {
        if (student.attendance[dateId] !== undefined) {
          if (student.attendance[dateId].attended) {
            if (makeUpDate === undefined) {
              attended = true;
            }
          }
        }
      }

      if (payment !== undefined) {
        if (
          _.find(payment.termsPaid[selectedTerm], o => {
            return moment(o.date).isSame(dateId, "day");
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
          if (moment(date).isSame(selectedDate, "day")) {
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
        if (moment(date).isBetween(term[0], term[term.length - 1], "day")) {
          t = parseInt(id);
        } else if (moment(date).isAfter(term[term.length - 1], "day")) {
          t = parseInt(id) + 1;
        }
      });
    }
  });
  return t;
}

export function getTermByDate(calendar, date) {
  var t = 1;
  var year = moment().year();
  var terms = calendar.terms[year];
  Object.keys(terms).map(id => {
    var term = terms[id];
    if (moment(date).isBetween(term[0], term[term.length - 1], "day")) {
      t = parseInt(id);
    } else if (moment(date).isAfter(term[term.length - 1], "day")) {
      t = parseInt(id) + 1;
    }
  });

  return t;
}

export function getClassTerm(calendar, date) {
  var t = 1;
  if (calendar !== undefined) {
    Object.keys(calendar.terms).map(id => {
      var term = calendar.terms[id];
      if (moment(date).isBetween(term[0], term[term.length - 1], null, "[]")) {
        t = parseInt(id);
      } else if (moment(date).isAfter(term[term.length - 1])) {
        t = parseInt(id) + 1;
      }
    });
  }

  return t;
}

export function getCalendarKey(student, classes, ag) {
  var key = "";
  let sKey = "";
  var studentAgeGroup = "";
  var currentClassDay, currentClassTime;
  if (student.ageGroup === undefined) {
    studentAgeGroup = ag;
    currentClassDay = moment(student.dateOfTrial).format("dddd");
    currentClassTime = student.timeOfTrial;
  } else {
    studentAgeGroup = student.ageGroup;
    currentClassDay = _.capitalize(student.currentClassDay);
    currentClassTime = student.currentClassTime;
  }
  Object.keys(classes).forEach(classId => {
    var { ageGroup, day, startTime, endTime, calendarKey } = classes[classId];
    if (ageGroup === studentAgeGroup) {
      if (day === currentClassDay) {
        sKey = calendarKey;
        var classTime = startTime + " - " + endTime;
        if (classTime === currentClassTime) {
          key = calendarKey;
        }
      }
    }
  });
  if (key === "") {
    key = sKey;
  }
  return key;
}

export function checkEarlyBird(actualTerms, sessionDates, date) {
  let check = false;
  let year = moment(date).year();
  Object.keys(sessionDates).map(termId => {
    const term = sessionDates[termId];
    if (actualTerms[year][termId].length === term.length) {
      if (moment(date).isSameOrBefore(actualTerms[year][termId][1], 'day')) {
        check = true;
      }
    }
  });
  return check;
}

export function getCalendarDates(calendar) {
  var calendarDates = [];
  Object.keys(calendar.terms).map(year => {
    Object.keys(calendar.terms[year]).map(termId => {
      var term = calendar.terms[year][termId];
      term.map(date => {
        calendarDates.push(moment(date));
      });
    });
  });
  return calendarDates;
}

export function isManager(auth, users) {
  var user = _.find(users, ["email", auth.email]);
  if (user !== undefined) {
    if (user.assignedRoles === "Manager") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function isSuperAdmin(email) {
  var superAdminUser = ["ray@fka.sg", "jimmybeh@fka.sg", "helmy@fka.sg"];
  if (superAdminUser.indexOf(email) !== -1) {
    return true;
  }
  return false;
}

export function getActive(students) {
  return _.filter(students, o => {
    return !(o.status === "Not Active");
  });
}

export function getNotActive(students) {
  return _.filter(students, o => {
    return o.status === "Not Active";
  });
}

export function getCentreCalendarDates(calendars) {
  var termDates = [];
  Object.keys(calendars).map(calendarKey => {
    var calendar = calendars[calendarKey];
    Object.keys(calendar.terms).map(year => {
      Object.keys(calendar.terms[year]).map(termId => {
        var term = calendar.terms[year][termId];
        term.map(date => {
          date = moment(date).format("YYYYMMDD");
          termDates.push(moment(date));
        });
      });
    });
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
          date = moment(date).format("YYYYMMDD");
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
    var endTime = o.endTime.split(":");
    if (endTime[1] === undefined) {
      endTime = o.endTime.split(".");
    }
    if (endTime[1].endsWith("pm")) {
      endTime[0] = endTime[0] + 12;
    }
    endTime = endTime[0] + ":" + endTime[1];
    return endTime;
  });
}

export function filterByAMPM(classes) {
  return _.filter(classes, o => {
    var startTime = o.startTime.split(":");
    if (startTime[1].endsWith(this.state.filter)) {
      return true;
    } else {
      false;
    }
  });
}

export function attendedDate(attendance, date) {
  let formattedDate = moment(date).format("YYYY-MM-DD")
  if (attendance !== undefined) {
    if (attendance[formattedDate] !== undefined) {
      return attendance[formattedDate].attended;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function paidDate(payments, date, term, year) {
  var payment = _.find(payments, o => {
    if (o.termsPaid !== undefined) {
      if (o.termsPaid[term] !== undefined) {
        return moment(o.date).year() === parseInt(year);
      }
    }
  });
  if (payment !== undefined) {
    if (
      _.find(payment.termsPaid[term], o => {
        if (moment(o.date).isSame(date, "day")) {
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
        group[studentId].attendance[moment(date).format("YYYY-MM-DD")] !==
        undefined
      ) {
        if (
          group[studentId].attendance[moment(date).format("YYYY-MM-DD")]
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
  if (dob === undefined) {
    return null;
  } else {
    var now = moment();
    var dateofbirth = moment(JSON.stringify(dob), "YYYY-MM-DD");
    var age = now.diff(dateofbirth, "years");
    var childAgeGroup;
    ageGroup.map(group => {
      if (age >= group.minAge && age <= group.maxAge) {
        childAgeGroup = group.name;
        if (childAgeGroup === "U8B") {
          childAgeGroup = "U8";
        }
      }
    });
    return childAgeGroup;
  }
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

export function getTermId(calendars) {
  let termId = 0;
  Object.keys(calendars).map(calendarKey => {
    let terms = calendars[calendarKey].terms;
    Object.keys(terms).map(id => {
      let term = terms[id];
      if (moment().isBetween(term[0], term[term.length - 1], null, "[]")) {
        termId = parseInt(id);
      } else if (moment().isAfter(term[term.length - 1])) {
        termId = parseInt(id) + 1;
      }
    });
  });
  return termId;
}

export function paidTerm(payments, term, year) {
  var payment = _.find(payments, o => {
    if (o.termsPaid !== undefined) {
      if (o.termsPaid[term] !== undefined) {
        return moment(o.date).year() === parseInt(year);
      }
    }
    return false;
  });
  if (payment !== undefined) {
    return true;
  } else {
    return false;
  }
}

export function makeUpDate(makeUps, date) {
  const toMakeUp = _.find(makeUps, d => {
    return moment(d.toDate).isSame(date, "day");
  });
  const fromMakeUp = _.find(makeUps, d => {
    return moment(d.fromDate).isSame(date, "day");
  });

  return {
    to: !(toMakeUp === undefined),
    from: !(fromMakeUp === undefined)
  };
}

export function getCKey(classes, ageGroup, timeDay) {
  let cKey, sKey;
  Object.keys(classes).forEach(classId => {
    const c = classes[classId];
    if (c.ageGroup === ageGroup) {
      sKey = c.calendarKey;
      const classTime = c.startTime + " - " + c.endTime;
      const classTimeDay = classTime + " (" + c.day + ")";
      if (classTimeDay === timeDay) {
        cKey = c.calendarKey;
      }
    }
  });
  if (cKey === undefined) {
    cKey = sKey;
  }
  return cKey;
}

export function getSessionDates(terms, startDate) {
  let selected = {};
  let count = 0;
  Object.keys(terms).map(year => {
    Object.keys(terms[year]).map(termId => {
      let term = terms[year][termId];
      let newTermDates = _.filter(term, date => {
        return moment(date).isSameOrAfter(startDate, "day");
      });

      if (newTermDates.length > 0 && count < 2) {
        selected[termId] = newTermDates;
        if (newTermDates.length > 4) {
          count = 2;
        } else {
          count += 1;
        }
      }
    });
  });

  return selected;
}

export function getTotalSessions(sessionDates) {
  let total = 0;
  Object.keys(sessionDates).map(termId => {
    total += sessionDates[termId].length;
  });
  return total;
}

export function getTermFee(dates, totalSessions) {
  let cost = 0;
  switch (dates.length) {
    case 8:
      cost = 300;
      break;
    case 7:
      cost = 270;
      break;
    case 6:
      cost = 240;
      break;
    case 5:
      cost = 220;
      break;
    default:
      cost = dates.length * (totalSessions > 8 ? 35 : 45);
      break;
  }
  return cost;
}

export function getPerSession(sessionDates) {
  let childPerSession = [];
  Object.keys(sessionDates).map(termId => {
    const term = sessionDates[termId];
    let perSession = 0;
    switch (term.length) {
      case 8:
        perSession = 37.5;
        break;
      case 7:
        perSession = 38.5;
        break;
      case 6:
        perSession = 40;
        break;
      case 5:
        perSession = 44;
        break;
      default:
        perSession = term.length > 8 ? 35 : 45;
        break;
    }
    childPerSession[termId] = perSession;
  });
  return childPerSession;
}

export function getBreakDown(students) {
  let termFee = [];
  let termsTotal = [];
  let perSession = [];
  Object.keys(students).map(key => {
    const { sessionDates } = students[key];
    if (sessionDates !== undefined) {
      let termTotal = [];
      termsTotal[key] = 0;
      Object.keys(sessionDates).map(termId => {
        const dates = sessionDates[termId];
        const fee = getTermFee(dates, getTotalSessions(sessionDates));
        termTotal[termId] = fee;
        termsTotal[key] += fee;
      });
      termFee[key] = termTotal;
    }
  });
  return {
    termFee,
    termsTotal
  };
}

export function getAllCalendarKeys(classes, ageGroup) {
  let calendarKeys = [];
  Object.keys(classes).map(classId => {
    const c = classes[classId];
    if (ageGroup === undefined) {
      calendarKeys.push(c.calendarKey);
    } else if (ageGroup === c.ageGroup) {
      calendarKeys.push(c.calendarKey);
    }
  });
  return _.uniq(calendarKeys);
}

export function getCalendarKeysByCentre(calendars, centreKey) {
  let calendarKeys = [];
  Object.keys(calendars).map(calendarKey => {
    if (calendars[calendarKey].centreKey === centreKey) {
      calendarKeys.push(calendarKey);
    }
  });
  return calendarKeys;
}

export function getAllCalendarDatesByTerm(
  calendars,
  calendarKeys,
  selectedTerm
) {
  let calendarDates = [];
  calendarKeys.map(calendarKey => {
    const calendar = calendars[calendarKey];
    const term = calendar.terms[selectedTerm];
    term.map(date => {
      calendarDates.push(date);
    });
  });

  return _.uniq(calendarDates).sort();
}

export function getAllCalendarDates(calendars, calendarKeys) {
  let calendarDates = [];
  calendarKeys.map(calendarKey => {
    const calendar = calendars[calendarKey];
    Object.keys(calendar.terms).map(year => {
      Object.keys(calendar.terms[year]).map(termId => {
        const term = calendar.terms[year][termId];
        term.map(date => {
          calendarDates.push(date);
        });
      });
    });
  });

  return _.uniq(calendarDates).sort();
}

export function getAllClassTimeDays(classes, ag, dayOfTrial) {
  let classTimeDays = [];
  Object.keys(classes).map(classId => {
    const { ageGroup, day, startTime, endTime } = classes[classId];
    if (ag === undefined) {
      if (day === dayOfTrial) {
        let classTime = startTime + " - " + endTime;
        let classTimeDay = classTime + " (" + day + ")";
        classTimeDays.push({ key: classTimeDay, value: classTime + "," + day });
      } else {
        let classTime = startTime + " - " + endTime;
        let classTimeDay = classTime + " (" + day + ")";
        classTimeDays.push({ key: classTimeDay, value: classTime + "," + day });
      }
    } else if (ag === ageGroup) {
      if (day === dayOfTrial) {
        let classTime = startTime + " - " + endTime;
        let classTimeDay = classTime + " (" + day + ")";
        classTimeDays.push({ key: classTimeDay, value: classTime + "," + day });
      }
    }
  });
  return _.uniqBy(classTimeDays, "key");
}

export function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
