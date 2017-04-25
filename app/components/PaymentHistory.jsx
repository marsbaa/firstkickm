import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
var actions = require('actions')
import moment from 'moment'
import {Grid, Col, Row, PanelGroup, Panel} from 'react-bootstrap'

class PaymentHistory extends React.Component {

  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/payment", "Payment History"));
  }

  render() {
    var {payments, students} = this.props
    var studentId = this.props.params.studentId
    var student = _.find(students, {key: studentId})
    var html = []
    if (student.payments === undefined) {
      html.push(<p style={{textAlign: 'center'}} key="nohistory">No payment history</p>)
    }
    else {
      html.push(<PanelGroup key="accordion" accordion>
        {Object.keys(student.payments).map((paymentId) => {
          var payment = _.find(payments, {key: student.payments[paymentId].paymentKey})
          return <Panel header={moment(payment.date).format('DD MMM YYYY')} eventKey={payment.key} key={payment.key}>{payment.total}</Panel>

        })}
      </PanelGroup>)
    }

   return (
     <Grid style={{paddingTop: '20px', paddingBottom: '200px'}}>
       <Row style={{padding: '10 0'}}>
         <Col>
           <p style={{textAlign: 'center', fontSize: '16px', fontWeight: 'bold', textDecoration:' underline'}}>{student.childName}</p>
           {html}
         </Col>
       </Row>
     </Grid>
   );
 }
 }

 export default connect((state) => {return state;
})(PaymentHistory);
