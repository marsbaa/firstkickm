import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import {Row, Col, Button, ButtonGroup, Grid, Glyphicon} from 'react-bootstrap'
import moment from 'moment'
import {normalbtn, selectedbtn} from 'styles.css'

class TotalCollection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: 'all'
    }
  }

  componentWillMount(){
    var {dispatch, payments, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/payment", selection.name+" Collections"));
    if (_.isEmpty(payments)) {
      dispatch(actions.startPayments())
    }
  }

  handleSelect(e) {
    e.preventDefault()
    var id = e.target.id
    var className = e.target.className
    if (id === 'all' && className === 'normalbtn btn btn-default'){
      e.target.className = 'selectedbtn btn btn-default'
      document.getElementById('am').className = 'normalbtn btn btn-default'
      document.getElementById('pm').className = 'normalbtn btn btn-default'
      this.setState({filter: 'all'})
    }
    else if (id === 'am' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default'
      document.getElementById('all').className = 'normalbtn btn btn-default'
      document.getElementById('pm').className = 'normalbtn btn btn-default'
      this.setState({filter: 'am'})
    }
    else if (id === 'pm' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default'
      document.getElementById('all').className = 'normalbtn btn btn-default'
      document.getElementById('am').className = 'normalbtn btn btn-default'
      this.setState({filter: 'pm'})
    }
  }
  render() {
    var {payments, selection} = this.props;
    var html = []
    var filteredPayments = _.filter(payments, (p) => {
      return moment(p.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
    })
    if (this.state.filter === 'am') {
      filteredPayments = _.filter(filteredPayments, (p) => {
        return moment(p.date).format('HH') <= 12
      })
    }
    else if (this.state.filter === 'pm') {
      filteredPayments = _.filter(filteredPayments, (p) => {
        return moment(p.date).format('HH') > 12
      })
    }
    filteredPayments = _.filter(filteredPayments, ['centreId', selection.id])
    if (_.size(filteredPayments) !== 0) {
      var cashPayments = _.filter(filteredPayments, ['paymentMethod', 'Cash'])
      if (_.size(cashPayments) !== 0) {
        var total = 0;
        html.push(
          <Row key='cashpayments' style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
             <Col xs={8} md={8}>
               <h5>Cash Collections</h5>
             </Col>
               <Col xs={4} md={4}>
             </Col>
           </Row>
          )
        cashPayments.map((payment) => {
          html.push(
            <Row key= {payment.childKey} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
              <Col xs={8} md={8} style={{fontSize: '14px'}}>
                <Glyphicon glyph="user" /> {payment.childName}
              </Col>
              <Col xs={4} md={4} style={{textAlign:'right'}}>
                ${payment.total}
              </Col>
            </Row>
            )
          total += payment.total
        })
        html.push(
          <Row key= 'totalCashPayment' style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
            <Col xs={6} md={6}>
            </Col>
            <Col xs={6} md={6} style={{fontWeight: 'bold',textAlign:'right', fontSize: '14px'}}>
              Total Cash: ${total}
            </Col>
          </Row>
        )
      }
      var chequePayments = _.filter(filteredPayments, ['paymentMethod', 'Cheque'])
      if (_.size(chequePayments) !== 0) {
        var total = 0;
        html.push(
          <Row key='chequepayments' style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
             <Col xs={8} md={8}>
               <h5>Cheque Collections</h5>
             </Col>
               <Col xs={4} md={4}>
             </Col>
           </Row>
          )
        chequePayments.map((payment) => {
          html.push(
            <Row key= {payment.childKey} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
              <Col xs={5} md={5} style={{fontSize: '14px'}}>
                <Glyphicon glyph="user" /> {payment.childName}
              </Col>
              <Col xs={4} md={4}>
                #{payment.chequeNumber}
              </Col>
              <Col xs={3} md={3} style={{textAlign:'right'}}>
                ${payment.total}
              </Col>
            </Row>
          )
          total += payment.total
        })
        html.push(
          <Row key= 'totalChequePayment' style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
            <Col xs={6} md={6}>
            </Col>
            <Col xs={6} md={6} style={{fontWeight: 'bold',textAlign:'right', fontSize: '14px'}}>
              Total Cheque: ${total}
            </Col>
          </Row>
          )
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
         <Row style={{textAlign: 'center', margin: '10px 10px'}}>
           <Col xs={12} md={12}>
             <ButtonGroup>
                <Button id='all' style={{margin: '0px'}} className="selectedbtn" onClick={this.handleSelect.bind(this)}>All</Button>
                <Button id='am' style={{margin: '0px'}}  className="normalbtn" onClick={this.handleSelect.bind(this)}>AM</Button>
                <Button id='pm' style={{margin: '0px'}} className="normalbtn" onClick={this.handleSelect.bind(this)}>PM</Button>
             </ButtonGroup>
           </Col>
         </Row>
         {html}
     </div>

   );
 }
 }

 export default connect((state) => {return state;
})(TotalCollection);
