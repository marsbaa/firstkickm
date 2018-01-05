import React from "react";
import { Panel, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import filter from "lodash/filter";
import ChildPayDetails from "ChildPayDetails";
import RegistrationFee from "RegistrationFee";
import SiblingDiscount from "SiblingDiscount";
import PromotionDiscount from "PromotionDiscount";
import PayersPaymentMethodSelector from "PayersPaymentMethodSelector";
import EarlyBird from "EarlyBird";
import {
  getBreakDown,
  getTotalSessions,
  getCalendarKey,
  checkEarlyBird,
  getPerSession
} from "helper";
import moment from "moment";

class PaymentBreakdown2 extends React.Component {
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
    const { payers, classes, calendars, promotion } = this.props;
    const { termFee, termsTotal } = getBreakDown(payers);
    let count = 0;
    let total = 0;
    let html = [];
    let paymentDetails = [];
    let childDetails = [];

    Object.keys(payers).map((payerKey, index) => {
      const {
        childName,
        sessionDates,
        venueId,
        ageGroup,
        gender,
        currentClassDay,
        currentClassTime,
        dateOfBirth,
        id,
        medicalCondition,
        email
      } = payers[payerKey];

      if (sessionDates !== undefined) {
        const totalSessions = getTotalSessions(sessionDates);
        console.log(totalSessions)
        const actualTerms =
          calendars[getCalendarKey(payers[payerKey], classes)].terms;
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
        if (count > 0 && totalSessions > 4) {
          html.push(
            <SiblingDiscount
              key={"siblingdiscount" + childName}
              count={count}
              amount={sd}
            />
          );
          paymentDetail.siblingDiscount = true;
          paymentDetail.siblingDiscountAmount = count > 1 ? sd[1] : sd[0];
          childTotal -= count > 1 ? sd[1] : sd[0];
        } else {
          paymentDetail.siblingDiscount = false;
        }
        if (promotion !== undefined) {
          html.push(
            <PromotionDiscount
              key={"promotiondiscount" + childName}
              amount={promotion.amount}
              title={promotion.name}
            />
          );
          childTotal -= promotion.amount;
          paymentDetail.promotionDiscount = promotion.name;
          paymentDetail.promotionDiscountAmount = promotion.amount;
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
      }
      count++;
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
        <PayersPaymentMethodSelector
          total={total}
          receivedDate={this.state.receivedDate}
          handleReceivedDate={this.handleReceivedDate}
          paymentDetails={paymentDetails}
          childDetails={payers}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    payers: state.payers,
    classes: state.selection.classes,
    calendars: state.calendars,
    promotion: state.promotions[state.selectedPromotion]
  };
}

export default connect(mapStateToProps)(PaymentBreakdown2);
