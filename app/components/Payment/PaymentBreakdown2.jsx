import React from "react";
import { Panel, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import filter from "lodash/filter";
import reduce from "lodash/reduce";
import ChildPayDetails from "ChildPayDetails";
import RegistrationFee from "RegistrationFee";
import SiblingDiscount from "SiblingDiscount";
import SessionDiscount from "SessionDiscount";
import PromotionDiscount from "PromotionDiscount";
import PayersPaymentMethodSelector from "PayersPaymentMethodSelector";
import EarlyBird from "EarlyBird";
import {
  getBreakDown,
  getTotalSessions,
  getBreakdownWithSessionPromo,
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
    this.setState({ receivedDate: moment(date) });
  }

  render() {
    const eb = 20;
    const sd = [20, 30];
    const rg = 80;
    const {
      payers,
      classes,
      calendars,
      promotions,
      selectedPromotion,
      credits
    } = this.props;

    const feeBeforePromo = getBreakDown(payers);
    const { termFee, termsTotal } = getBreakdownWithSessionPromo(
      payers,
      selectedPromotion,
      promotions
    );
    let count = 0;
    let total = 0;
    let html = [];
    let paymentDetails = [];
    let childDetails = [];
    let parentEmail = "";
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
      if (email !== "") {
        parentEmail = email;
      }
      if (sessionDates !== undefined) {
        const totalSessions = getTotalSessions(sessionDates);
        const actualTerms =
          calendars[getCalendarKey(payers[payerKey], classes)].terms;
        let earlybird = checkEarlyBird(
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
        let promoOn = false;
        if (selectedPromotion !== undefined) {
          if (selectedPromotion[payerKey] !== undefined) {
            if (selectedPromotion[payerKey].promoKey !== "0") {
              promoOn = true;
            }
          }
        }

        if (earlybird && !promoOn) {
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
        if (promoOn) {
          let promoKey = selectedPromotion[payerKey].promoKey;
          let promotion = promotions[promoKey];
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

        let filteredCredits = filter(credits, o => {
          return o.dateUsed === undefined && !o.inactive;
        });
        let studentCredits = filter(filteredCredits, { studentKey: payerKey });
        if (studentCredits.length > 0) {
          let totalCredit = reduce(
            studentCredits,
            function(sum, n) {
              return sum + n.amount;
            },
            0
          );
          html.push(
            <Row
              key={"credit" + childName}
              style={{
                padding: "0px 15px",
                marginTop: "5px"
              }}
            >
              <Col xs={8} md={8}>
                <b
                  style={{
                    color: "#1796d3"
                  }}
                >
                  Credits
                </b>
              </Col>
              <Col
                xs={4}
                md={4}
                style={{
                  float: "right"
                }}
              >
                <p
                  style={{
                    textAlign: "right"
                  }}
                >
                  (${totalCredit})
                </p>
              </Col>
            </Row>
          );
          childTotal -= totalCredit;
          paymentDetail.credit = totalCredit;
          paymentDetail.credits = studentCredits;
        }

        let termsPaid = {};
        const perSession = getPerSession(sessionDates);
        Object.keys(sessionDates).map(termId => {
          const term = sessionDates[termId];
          let datesPaid = [];
          term.map(date => {
            datesPaid.push({ date, perSession: perSession[termId] });
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
        <Panel id="paymentBreakdown">
          <Panel.Heading>
            <font style={{ fontSize: "16px", fontWeight: "bold" }}>
              {" "}
              Fees Breakdown{" "}
            </font>
          </Panel.Heading>
          <Panel.Footer>
            <Row style={{ paddingRight: "20px" }}>
              {" "}
              <Col xs={8} md={8} lg={8}>
                <font
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                >
                  Total:
                </font>
              </Col>{" "}
              <Col xs={4} md={4} lg={4}>
                {" "}
                <font
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    float: "right",
                    textDecoration: "underline"
                  }}
                >
                  ${total}
                </font>{" "}
              </Col>{" "}
            </Row>
          </Panel.Footer>
          <Panel.Body>{html}</Panel.Body>
        </Panel>
        <PayersPaymentMethodSelector
          total={total}
          receivedDate={this.state.receivedDate}
          handleReceivedDate={this.handleReceivedDate}
          paymentDetails={paymentDetails}
          childDetails={payers}
          email={parentEmail}
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
    promotions: state.promotions,
    selectedPromotion: state.selectedPromotion,
    credits: state.credits
  };
}

export default connect(mapStateToProps)(PaymentBreakdown2);
