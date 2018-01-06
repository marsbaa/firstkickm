import React from "react";
import { Grid, Row, Col, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import filter from "lodash/filter";
import find from "lodash/find";
import isEmpty from 'lodash/isEmpty'
import { addPayers, resetSelectedPromotion, startPromotions } from "actions";
import PaymentChildTab from "PaymentChildTab";
import PaymentBreakdown2 from "PaymentBreakdown2";
import PromotionSelector from "PromotionSelector";
import moment from "moment";

class PaymentForm extends React.Component {
  componentWillMount() {
    let { dispatch, students, promotions } = this.props;
    let student = find(students, { key: this.props.params.studentId });
    let siblings;
    if (student.contact !== '' && student.contact !== undefined) {
      siblings = filter(students, { contact: student.contact });
    }
    let payers = {};
    siblings.map(s => {
      payers[s.key] = {
        ...s,
        startDate: moment().format()
      };
    });
    dispatch(addPayers(payers));
    dispatch(resetSelectedPromotion())
    if (isEmpty(promotions)) {
      dispatch(startPromotions());
    }
  }

  render() {
    const { payers } = this.props;
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12} lg={12}>
            <Tabs
              style={{ marginTop: "5px", fontWeight: "600" }}
              id="paymentTab"
            >
              {Object.keys(payers).map((payerKey, index) => {
                const { childName } = payers[payerKey];
                return (
                  <PaymentChildTab
                    key={payerKey}
                    eventKey={index}
                    title={childName}
                    payerKey={payerKey}
                  />
                );
              })}
            </Tabs>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <PaymentBreakdown2 />
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    students: filter(state.students, o => {
      return o.status !== 'Not Active'
    }),
    payers: state.payers,
    promotions: state.promotions
  };
}

export default connect(mapStateToProps)(PaymentForm);
