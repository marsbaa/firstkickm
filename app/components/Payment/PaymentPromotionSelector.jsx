import React from "react";
import { Panel, FormGroup, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { startPromotions, addSelectedPromotion } from "actions";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import moment from "moment";

class PaymentPromotionSelector extends React.Component {
  render() {
    const { dispatch, promotions, payerKey } = this.props;
    let filteredPromotions = filter(promotions, o => {
      return moment().isSameOrBefore(o.endDate, "day");
    });
    return (
      <Panel
        header={
          <font style={{ fontSize: "16px", fontWeight: "bold" }}>
            Promotion Discount
          </font>
        }
      >
        <FormGroup>
          <FormControl
            componentClass="select"
            defaultValue={0}
            onChange={e => {
              dispatch(addSelectedPromotion(e.target.value, payerKey));
            }}
          >
            <option key="0" value="0">
              select
            </option>
            {Object.keys(filteredPromotions).map(promoKey => {
              const { name, group, key } = filteredPromotions[promoKey];
              if (group === "Current" || group === "All") {
                return (
                  <option key={key} value={key}>
                    {name}
                  </option>
                );
              }
            })}
          </FormControl>
        </FormGroup>
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  return {
    promotions: state.promotions
  };
}

export default connect(mapStateToProps)(PaymentPromotionSelector);
