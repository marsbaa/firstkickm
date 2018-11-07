import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { startPromotions } from 'actions';
import ListHeader from 'ListHeader';
import ListContent from 'ListContent';
import { Link } from 'react-router';
import { updateNavTitle } from 'actions';

class PromotionsApp extends React.Component {
  componentWillMount() {
    const { dispatch, promotions } = this.props;
    if (isEmpty(promotions)) {
      dispatch(startPromotions());
    }
    dispatch(updateNavTitle('/m/promotions', 'Manage Promotions'));
  }
  render() {
    const { promotions } = this.props;
    return (
      <div>
        <ListHeader
          title={'Promotions'}
          button={
            <Link to="/m/promotions/add">
              <button
                className="btn"
                style={{ float: 'right', backgroundColor: '#f5bb05' }}
              >
                Add Promotion
              </button>
            </Link>
          }
        />
        {Object.keys(promotions).map(promoKey => {
          const { name, discount, type } = promotions[promoKey];
          return (
            <ListContent
              key={promoKey}
              contentLeft={name}
              contentRight={
                (type === 'Amount' ? '$' : '') +
                discount +
                (type === 'Percentage' ? '%' : '')
              }
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    promotions: state.promotions
  };
}

export default connect(mapStateToProps)(PromotionsApp);
