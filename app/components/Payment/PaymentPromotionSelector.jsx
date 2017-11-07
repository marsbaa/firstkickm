import React from 'react';
import { Panel, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  startPromotions,
  addSelectedPromotion,
  resetSelectedPromotion
} from 'actions';

class PaymentPromotionSelector extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(startPromotions());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetSelectedPromotion());
  }
  render() {
    const { promotions, dispatch } = this.props;
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
              dispatch(addSelectedPromotion(e.target.value));
            }}
          >
            <option key="0" value="">
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
