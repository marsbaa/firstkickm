import React from "react";
import { Panel, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import filter from "lodash/filter";
import ChildPayDetails from "ChildPayDetails";
import RegistrationFee from "RegistrationFee";
import SiblingDiscount from "SiblingDiscount";
import PromotionDiscount from "PromotionDiscount";
import SessionDiscount from "SessionDiscount";
import PaymentMethodSelector from "PaymentMethodSelector";
import EarlyBird from "EarlyBird";
import {
  getBreakDown,
  getBreakdownWithSessionPromo,
  getTotalSessions,
  getCalendarKey,
  checkEarlyBird,
  getPerSession
} from "helper";
import moment from "moment";

class PaymentBreakdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedDate: moment()
    };
    this.handleReceivedDate = this.handleReceivedDate.bind(this);
  }

  handleReceivedDate(date) {
    this.setState({
      receivedDate: moment(date)
    });
  }

  render() {
    const eb = 20;
    const sd = [20, 30];
    const rg = 80;
    const {
      register,
      classes,
      calendars,
      parent,
      promotions,
      selectedPromotion
    } = this.props;
    const feeBeforePromo = getBreakDown(register);
    console.log(feeBeforePromo);
    const { termFee, termsTotal } = getBreakdownWithSessionPromo(
      register,
      selectedPromotion,
      promotions
    );
    console.log(selectedPromotion);
    let count = 0;
    let total = 0;
    let html = [];
    let paymentDetails = [];
    let childDetails = [];

    Object.keys(register).map((payerKey, index) => {
      const {
        childName,
        sessionDates,
        notJoining,
        venueId,
        ageGroup,
        gender,
        currentClassDay,
        currentClassTime,
        dateOfBirth,
        id,
        medicalCondition,
        email
      } = register[payerKey];
      childDetails[payerKey] = {
        childName,
        ageGroup,
        currentClassTime,
        currentClassDay,
        dateOfBirth,
        gender,
        trialId: id,
        medicalCondition,
        venueId
      };
      const totalSessions = getTotalSessions(sessionDates);
      const actualTerms =
        calendars[getCalendarKey(register[payerKey], classes)].terms;
      const earlybird = checkEarlyBird(
        actualTerms,
        sessionDates,
        this.state.receivedDate
      );
      //Display Term Fee
      let paymentDetail = {};
      let childTotal = 0;
      html.push(
        <ChildPayDetails
          key={childName}
          childName={childName}
          sessionDates={sessionDates}
          termFee={termFee[payerKey]}
        />
      );
      childTotal += termsTotal[payerKey];
      html.push(
        <RegistrationFee key={"registration" + childName} amount={rg} />
      );
      paymentDetail.registration = true;
      paymentDetail.registrationAmount = rg;
      childTotal += rg;
      count += 1;

      //Display Early Bird Discount
      if (earlybird) {
        html.push(<EarlyBird key={"earlybird" + childName} amount={eb} />);
        childTotal -= eb;
        paymentDetail.earlyBird = true;
        paymentDetail.earlyBirdAmount = eb;
      } else {
        paymentDetail.earlyBird = false;
      }

      //Display Sibling Discount
      if (count > 1 && totalSessions > 4) {
        html.push(
          <SiblingDiscount
            key={"siblingdiscount" + childName}
            count={count}
            amount={sd}
          />
        );
        paymentDetail.siblingDiscount = true;
        paymentDetail.siblingDiscountAmount = count > 2 ? sd[1] : sd[0];
        childTotal -= count > 2 ? sd[1] : sd[0];
      } else {
        paymentDetail.siblingDiscount = false;
      }
      if (selectedPromotion !== undefined) {
        if (
          selectedPromotion["trial"] !== undefined &&
          selectedPromotion["trial"].promoKey !== "0"
        ) {
          let promotion = promotions[selectedPromotion["trial"].promoKey];
          if (promotion !== undefined) {
            const { type, discount, name } = promotion;
            let discountAmount = 0;
            if (type === "Percentage") {
              discountAmount = termsTotal[payerKey] * discount / 100;
              html.push(
                <PromotionDiscount
                  key={"promotiondiscount" + childName}
                  amount={discountAmount}
                  title={name}
                />
              );
              childTotal -= discountAmount;
            } else if (type === "Amount") {
              discountAmount = discount;
              html.push(
                <PromotionDiscount
                  key={"promotiondiscount" + childName}
                  amount={discountAmount}
                  title={name}
                />
              );
              childTotal -= discountAmount;
            } else if (type === "Session") {
              discountAmount =
                feeBeforePromo.termsTotal[payerKey] - termsTotal[payerKey];
              html.push(
                <SessionDiscount
                  key={"sessiondiscount" + childName}
                  amount={discount}
                  title={name}
                />
              );
            }

            paymentDetail.promotionDiscount = name;
            paymentDetail.promotionDiscountAmount = discountAmount;
          }
        }
      }
      let termsPaid = [];
      const perSession = getPerSession(sessionDates);
      Object.keys(sessionDates).map(termId => {
        const term = sessionDates[termId];
        let datesPaid = [];
        term.map(date => {
          datesPaid.push({
            date,
            perSession: perSession[termId]
          });
          termsPaid[termId] = datesPaid;
        });
      });
      paymentDetail.total = childTotal;
      paymentDetail.classTime = currentClassTime;
      paymentDetail.ageGroup = ageGroup;
      paymentDetail.childName = childName;
      paymentDetail.email = email;
      paymentDetail.classDay = currentClassDay;
      paymentDetail.centreId = venueId;
      paymentDetail.termsPaid = termsPaid;
      total += childTotal;
      paymentDetails[payerKey] = paymentDetail;
    });

    return (
      <div>
        <Panel
          header={
            <font style={{ fontSize: "16px", fontWeight: "bold" }}>
              Fees Breakdown
            </font>
          }
          footer={
            <Row style={{ paddingRight: "20px" }}>
              <Col xs={8} md={8} lg={8}>
                <font style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Total:
                </font>
              </Col>
              <Col xs={4} md={4} lg={4}>
                <font
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    float: "right",
                    textDecoration: "underline"
                  }}
                >
                  ${total}
                </font>
              </Col>
            </Row>
          }
        >
          {html}
        </Panel>
        <PaymentMethodSelector
          total={total}
          receivedDate={this.state.receivedDate}
          handleReceivedDate={this.handleReceivedDate}
          paymentDetails={paymentDetails}
          childDetails={childDetails}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    register: filter(state.register, o => !o.notJoining),
    classes: state.selection.classes,
    calendars: state.calendars,
    promotions: state.promotions,
    selectedPromotion: state.selectedPromotion
  };
}

export default connect(mapStateToProps)(PaymentBreakdown);
