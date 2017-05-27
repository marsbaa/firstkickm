import React from 'react'
import ScheduleList from 'ScheduleList'

class ScheduleContainer extends React.Component{

  render() {
    var { calendarKey, date, term } = this.props.params
   return (
     <ScheduleList key={date} calendarKey={calendarKey} date={date} term={term}/>
   );
  }
}

 export default (ScheduleContainer);
