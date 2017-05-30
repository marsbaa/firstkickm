import React from 'react';
import DayPicker, {DateUtils} from 'react-day-picker';
import "react-day-picker/lib/style.css"
import _ from 'lodash'
var actions = require('actions');
import {Link} from 'react-router'
var {connect} = require('react-redux');

class MultipleDayPicker extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedDays: []
    }
  }

  handleDayClick(day, { selected }) {
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
  }

  componentWillMount() {
     var {terms} = this.props;
     var id = this.props.tab;
     const { selectedDays } = this.state;
     if (!(_.isEmpty(terms))) {
        if(!(_.isEmpty(terms[id]))) {
          terms[id].map((day) =>
          {
            var newDay = new Date(day);
            selectedDays.push(newDay);
          });
        }
       this.setState({ selectedDays })
     }

  }


  render() {

   return (
     <DayPicker
         initialMonth={ this.state.selectedDays[0]}
         selectedDays={this.state.selectedDays}
          onDayClick={ this.handleDayClick.bind(this) }
          numberOfMonths={ 2 }
        />

   );
 }
 }

 export default connect((state) => {return state;
})(MultipleDayPicker);
