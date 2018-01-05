import React from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import isEmpty from "lodash/isEmpty";
import { updateSelectedDays } from "actions";
import { Link } from "react-router";
import { connect } from "react-redux";

class MultipleDayPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: []
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const { terms, year, tab } = this.props;
    if (nextProps.year !== year) {
      if (terms[nextProps.year] !== undefined) {
        if (terms[nextProps.year][tab] !== undefined) {
          let days = [];
          terms[nextProps.year][tab].map(i => {
            days.push(new Date(i));
          });
          this.setState({ selectedDays: days });
        }
      } else {
        this.setState({ selectedDays: [] });
      }
    }
  }

  componentWillMount() {
    const { terms, year, tab } = this.props;
    if (terms[year] !== undefined) {
      if (terms[year][tab] !== undefined) {
        let days = [];
        terms[year][tab].map(i => {
          days.push(new Date(i));
        });
        this.setState({ selectedDays: days });
      }
    }
  }

  handleDayClick(day, { selected }) {
    var { dispatch } = this.props;
    var id = this.props.tab;
    var year = this.props.year;
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });
    dispatch(updateSelectedDays(year, id, selectedDays));
  }

  render() {
    console.log(this.state.selectedDays[0])
    return (
      <DayPicker
        month={this.state.selectedDays[0]}
        selectedDays={this.state.selectedDays}
        onDayClick={this.handleDayClick.bind(this)}
        numberOfMonths={2}
      />
    );
  }
}

function mapStateToProps(state, props) {
  return {
    terms: state.terms
  };
}

export default connect(mapStateToProps)(MultipleDayPicker);
