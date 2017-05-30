import moment from 'moment'
import React from 'react'

export function findPaymentDetails(students, termDates, selectedTerm) {

  var paid = []
  var unpaid = []
  var paidDetails = []
  var paidAmount = 0

  Object.keys(students).map((studentId) => {
    var student = students[studentId]
    var attended = false
    var p = false

    //Check if payment is made for this term
    var payment = _.find(student.payments, (o) => {
      if (o.termsPaid !== undefined) {
        return o.termsPaid[selectedTerm] !== undefined }
      return false
    })

    if (payment !== undefined) {
      paid.push(student)
      paidDetails.push(payment)
      paidAmount += parseInt(payment.total)
      p = true
    }

    //Check if student attends term
    termDates.map((date) => {
      var dateId = moment(date).format("YYYY-MM-DD")
      if (student.attendance !== undefined) {
        if (student.attendance[dateId] !== undefined) {
          if (student.attendance[dateId].attended) {
            attended = true
          }
        }
      }

      if (payment !== undefined) {
        if (_.find(payment.termsPaid[selectedTerm], (o) => {return moment(o.date).isSame(dateId, 'day')}) !== undefined) {
          p = true

        }
      }
    })
    //If attended and not paid
    if (attended && !p) {
      unpaid.push(student)
    }
  })
  return {
    paid,
    paidAmount,
    paidDetails,
    unpaid
  }
}


export function classToday(calendars, centreKey) {
  var today = false;
  Object.keys(calendars).map((calendarKey) => {
    var calendar = calendars[calendarKey]
    if (calendar.centreKey === centreKey) {
      Object.keys(calendar.terms).map((termId) => {
        var term = calendar.terms[termId]
        term.map ((date)=> {
          if( moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
            today = true;
          }
        })
      })
    }
  });
  return today
}

export function termToday(calendars, centreKey) {
  var todayTerm = 1;
  Object.keys(calendars).map((calendarKey) => {
    var calendar = calendars[calendarKey]
    if (calendar.centreKey === centreKey) {
      var terms = calendar.terms;
      terms.map((term, id) => {
        if(moment().isBetween(term[0], term[term.length-1], null, '[]')) {
          todayTerm = id
        }
        else if (moment().isAfter(term[term.length-1])){
          todayTerm = id + 1
        }
      })
    }
  })
  return todayTerm
}

export function findCalendarKey(student, classes) {
  var calendarKey
  Object.keys(classes).forEach((classId) => {
      var {ageGroup, day, startTime, endTime, termKey} = classes[classId];
      if (ageGroup === student.ageGroup) {
        if (day.toLowerCase() === student.currentClassDay.toLowerCase()) {
          var classTime = startTime + " - " + endTime;
          if (classTime === student.currentClassTime) {
            calendarKey = termKey
          }
        }
      }
  })
  return calendarKey
}

export function getCalendarDates(calendar) {
  var calendarDates = []
  Object.keys(calendar.terms).map((termId) => {
    var term = calendar.terms[termId]
    term.map((date) => {
      calendarDates.push(moment(date));
    })
  })
  return calendarDates
}

export function isManager(auth, users) {
  var user = _.find(users, ['email', auth.email])
  if (user !== undefined) {
    if (user.assignedRoles === 'Manager') {
      return true
    }
    else {
      return false
    }
  }
  else {
    return false
  }
}
