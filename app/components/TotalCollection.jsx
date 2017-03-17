import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import {Row, Col} from 'react-bootstrap'
import moment from 'moment'

class TotalCollection extends React.Component {

  componentWillMount(){
    var {dispatch, centres, payments, selection} = this.props;
    var centre;
    centres.map((c) => {
      if(c.id === selection) {
        centre = c;
      }
    });
    dispatch(actions.updateNavTitle("/m/payment", centre.name+" Payment"));
    if (_.isEmpty(payments)) {
      dispatch(actions.startPayments())
    }
  }
  render() {
    var {payments, selection} = this.props;
    var html = []
    var filteredPayments = _.filter(payments, ['date', moment().format('YYYY-MM-DD')]);
    filteredPayments = _.filter(filteredPayments, ['centreId', selection])
    if (_.size(filteredPayments) !== 0) {
      var cashPayments = _.filter(filteredPayments, ['paymentMethod', 'Cash'])
      if (_.size(cashPayments) !== 0) {
        var total = 0;
        html.push(<Row key='cashpayments' style={{backgroundColor: '#555', color: '#fff'}}>
        <Col xs={12} md={12}>
          Cash Collections
        </Col>
        </Row>)
        cashPayments.map((payment) => {
          html.push(<Row key={payment.childKey} style={{borderBottom: 'dotted #b4b4b4', padding: '3px 3px'}}>
            <Col xs={5} md={5}>
              {payment.childName}
            </Col>
            <Col xs={4} md={5}></Col>
            <Col xs={3} md={3}>
              {payment.total}
            </Col>
          </Row>)
          total += payment.total
        })
        html.push(<Row key='cashpaymentsTotal' style={{marginTop:'10px', marginBottom: '30px', textAlign: 'right'}}>
        <Col xs={12} md={12}>
          <b style={{fontSize:'14px'}}>Total Cash: ${total}</b>
        </Col>
        </Row>)
      }
      var chequePayments = _.filter(filteredPayments, ['paymentMethod', 'Cheque'])
      if (_.size(chequePayments) !== 0) {
        var total = 0;
        html.push(<Row key='chequepayments' style={{backgroundColor: '#555', color: '#fff'}}>
        <Col xs={12} md={12}>
          Cheque Collections
        </Col>
        </Row>)
        chequePayments.map((payment) => {
          html.push(<Row key={payment.childKey} style={{borderBottom: 'dotted #b4b4b4', padding: '3px 3px'}}>
            <Col xs={5} md={5}>
              {payment.childName}
            </Col>
            <Col xs={4} md={4}>
              #{payment.chequeNumber}
            </Col>
            <Col xs={3} md={3}>
              {payment.total}
            </Col>
          </Row>)
          total += payment.total
        })
        html.push(<Row key='chequepaymentsTotal' style={{marginTop:'10px', marginBottom: '30px', textAlign: 'right'}}>
        <Col xs={12} md={12}>
          <b style={{fontSize:'14px'}}>Total Cheque: ${total}</b>
        </Col>
        </Row>)
      }
    }
    else {

      html.push(<Row key='noCollection' style={{marginTop:'10px', marginBottom: '30px', textAlign: 'center'}}>
      <Col xs={12} md={12}>
        <b style={{fontSize:'14px'}}>No Payment Collected Today</b>
      </Col>
      </Row>)
    }

   return (
     <div>
       {html}
     </div>

   );
 }
 }

 export default connect((state) => {return state;
})(TotalCollection);
