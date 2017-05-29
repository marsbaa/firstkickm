import moment from 'moment'
import React from 'react'

export function classToday(calendars, centreKey) {
  var today = false;
  Object.keys(calendars).map((calendarKey) => {
    var calendar = calendars[calendarKey]
    if (calendars[calendarKey].centreKey === centreKey) {
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
