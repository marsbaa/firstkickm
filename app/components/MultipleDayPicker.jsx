import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import "react-day-picker/lib/style.css"
import _ from 'lodash'
var actions = require('actions');
import {Link} from 'react-router'
var {connect} = require('react-redux');

export var MultipleDayPicker = React.createClass({
  getInitialState: function() {
    return {
      selectedDays: []
    };
  },

  isDaySelected(day) {
    return this.state.selectedDays.some(selectedDay =>
      DateUtils.isSameDay(selectedDay, day),
    );
  },

  handleDayClick(e, day, { selected }) {
    var {dispatch} = this.props;
    var id = this.props.tab;
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day),
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });
    dispatch(actions.updateSelectedDays(id, selectedDays));
  },

  render: function () {
   return (
     <DayPicker
          selectedDays={ this.isDaySelected}
          onDayClick={ this.handleDayClick }
          numberOfMonths={ 2 }
        />

   );
 }
 });

 export default connect((state) => {return state;
})(MultipleDayPicker);
