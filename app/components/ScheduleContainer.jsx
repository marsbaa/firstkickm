import React from 'react'
import ScheduleList from 'ScheduleList'

class ScheduleContainer extends React.Component{

  render() {
    var calendarKey = this.props.params.calendarKey;
    var date = this.props.params.date;

   return (
     <ScheduleList key={date} calendarKey={calendarKey} date={date} />
   );
  }
}

 export default (ScheduleContainer);
