import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import "react-day-picker/lib/style.css"
import _ from 'lodash'

export var MultipleDayPicker = React.createClass({
  getInitialState: function() {
    return {
      selectedDays : []
    };
  },

  printDates: function() {
    if (this.state.selectedDays.length != 0) {
      this.state.selectedDays.map((d) => {
        console.log(d);
      });
    }
    else {
      console.log("No Dates Selected for this term");
    }

  },

  handleDayClick(e, day, { selected }) {
      var pSelected = this.state.selectedDays;
      var found = _.findIndex(pSelected, (d) => {return DateUtils.isSameDay(d, day)});
      if (found != -1) {
            pSelected.splice(found, 1);
      }
      else {
        pSelected.push(day);
      }
      this.setState({
        selectedDays: pSelected
      });
    },
  render: function () {
   const { selectedDays } = this.state;
   return (
     <DayPicker numberOfMonths={ 2 } onDayClick={ this.handleDayClick } selectedDays = {day => {
         if (selectedDays.length != 0) {
          var f = selectedDays.map((d) => {
           return DateUtils.isSameDay(day, d)});
           var dateMatch = _.findIndex(f, (b) => {return b === true});
           if (dateMatch != -1) {
             return true;
           }
           else {
             return false;
           }
       }}}/>
   );
 }
 });

 export default (MultipleDayPicker);
