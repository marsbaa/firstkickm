import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
var actions = require('actions')
import moment from 'moment'
import PaymentDetails from 'PaymentDetails'
import {Grid, Col, Row, PanelGroup, Panel, ControlLabel, Modal, Button} from 'react-bootstrap'
import {browserHistory} from 'react-router'

class PaymentHistory extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      show: false,
      paymentKey : '',
      childKey : ''
    }
    this.handleSelect = this.handleSelect.bind(this)
  }
  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/payment", "Payment History"));
  }

  handleSelect(paymentKey, childKey) {
    this.setState({show : true})
    this.setState({paymentKey})
    this.setState({childKey})
  }

  formSubmit() {
    var {dispatch} = this.props
    dispatch(actions.removePayment(this.state.paymentKey, this.state.childKey))
    browserHistory.push('/m/payments')
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
            return <Panel header={
              <Row>
                <Col xs={7} md={7}>
                  <ControlLabel>
                    {moment(payment.date).format('DD MMM YYYY') +" - Total : $" + payment.total}
                  </ControlLabel>
                </Col>
                <Col xs={5} md={5} style={{textAlign: 'right'}}>
                  <button className="btn" style={{float:'right'}} onClick={(e) => {
                      e.preventDefault();
                      this.handleSelect(payment.key, payment.childKey)}}>Remove</button>
                </Col>
              </Row>}
               eventKey={payment.key} key={payment.key}>
              <PaymentDetails payment={payment} />
                <Modal
                   show={this.state.show}
                   onHide={close}
                   container={this}
                   aria-labelledby="contained-modal-title"
                 >
                   <Modal.Header closeButton>
                     <Modal.Title id="contained-modal-title">Delete Payment Records</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                     Are you sure you want to delete payment record of ${payment.total} made on {moment(payment.date).format("DD MMM YYYY")} ?
                   </Modal.Body>
                   <Modal.Footer>
                     <Button bsSize='large' onClick={this.formSubmit.bind(this)}>Yes</Button>
                     <Button bsSize='large' onClick={close}>No</Button>
                   </Modal.Footer>
                </Modal>
            </Panel>

          })}
        </PanelGroup>)
    }
  let close = () => this.setState({show:false})

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
