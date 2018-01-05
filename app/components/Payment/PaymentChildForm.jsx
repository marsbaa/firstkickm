import React from "react";
import { connect } from "react-redux";
import { Tab } from "react-bootstrap";
import filter from "lodash/filter";
import StartDateSelector from "StartDateSelector";
import PayersDateSelector from "PayersDateSelector";
import PaymentPromotionSelector from 'PaymentPromotionSelector';
import {
  getCentreKey,
  getCalendarDates,
  getCKey,
  getSessionDates
} from "helper";
import { updatePayersStartDate } from "actions";
import moment from "moment";

class PaymentChildForm extends React.Component {
    handlePromotionSelected(value, count) {
        let promotions = this.state.promotions;
        promotions[count] = value;
        this.setState({ promotions });
      }
  render() {
    const { dispatch, payer, classes, calendars, payerKey } = this.props;
    const { ageGroup, currentClassDay, currentClassTime, startDate } = payer;
    //Get Calendar Dates
    const timeDay = currentClassTime + " (" + currentClassDay + ")";
    const cKey = getCKey(classes, ageGroup, timeDay);
    const calendar = calendars[cKey];
    const calendarDates = getCalendarDates(calendar);
    //Get Term & Dates
    const sessionDates = getSessionDates(calendar.terms, startDate);
    return (
      <div style={{ margin: "15px 0px" }}>
        <StartDateSelector
          startDate={startDate}
          calendarDates={calendarDates}
          handleChange={selectedDate =>
            dispatch(updatePayersStartDate(selectedDate, payerKey))
          }
        />
        <PayersDateSelector
          sessionDates={sessionDates}
          payerKey={payerKey}
          startDate={startDate}
        />
        <PaymentPromotionSelector
          payerKey={payerKey}
          onChange={this.handlePromotionSelected.bind(this)}
        />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    payer: state.payers[props.payerKey],
    calendars: state.calendars,
    classes: filter(state.classes, { centreKey: state.selection.key })
  };
}

export default connect(mapStateToProps)(PaymentChildForm);
