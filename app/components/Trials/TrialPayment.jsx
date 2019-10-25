import React from 'react';
import { Grid, Row, Col, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import ChildPayTab from 'ChildPayTab';
import PaymentBreakdown from 'PaymentBreakdown';
import PromotionSelector from 'PromotionSelector';

class TrialPayment extends React.Component {
  render() {
    const { register } = this.props;
    console.log(register)
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12} lg={12}>
            <Tabs
              style={{ marginTop: '5px', fontWeight: '600' }}
              id="paymentTab"
            >
              {Object.keys(register).map((payerKey, index) => {
                const { childName, notJoining } = register[payerKey];
                if (!notJoining) {
                  return (
                    <ChildPayTab
                      key={payerKey}
                      eventKey={index}
                      title={childName}
                      payerKey={payerKey}
                    />
                  );
                }
              })}
            </Tabs>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <PromotionSelector />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <PaymentBreakdown />
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    register: state.register
  };
}

export default connect(mapStateToProps)(TrialPayment);
