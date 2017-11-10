import React from 'react';
import { Panel, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  startPromotions,
  addSelectedPromotion,
  resetSelectedPromotion
} from 'actions';
import isEmpty from 'lodash/isEmpty';

class PaymentPromotionSelector extends React.Component {
  componentWillMount() {
    const { dispatch, promotions } = this.props;
    if (!isEmpty(promotions)) {
      dispatch(startPromotions());
    }
  }

  render() {
    const { promotions, onChange, id } = this.props;
    return (
      <Panel
        header={
          <font style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Promotion Discount
          </font>
        }
      >
        <FormGroup>
          <FormControl
            componentClass="select"
            defaultValue={0}
            onChange={e => {
              onChange(e.target.value, id);
            }}
          >
            <option key="0" value="0">
              select
            </option>
            {Object.keys(promotions).map(promoKey => {
              const { name, group } = promotions[promoKey];
              if (group === 'Current' || group === 'All') {
                return (
                  <option key={promoKey} value={promoKey}>
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
