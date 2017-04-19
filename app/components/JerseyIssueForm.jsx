import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, ButtonGroup, Button} from 'react-bootstrap'
var actions = require('actions')
import {browserHistory} from 'react-router'
import _ from 'lodash'
import SignaturePad from 'react-signature-pad'
import moment from 'moment'


class JerseyIssueForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      size : ''
    }
  }

  handleSizeSelect(e, size) {
    this.setState({size})
    console.log(size)
  }

  clear() {
    var signature = this.refs.mySignature;
    signature.clear()
  }

  formSubmit(e) {
    var {dispatch, payments} = this.props
    var paymentKey = this.props.params.paymentKey
    var signature = this.refs.mySignature;
    var payment = _.find(payments, {key: paymentKey})
    console.log(payment)
    if (!signature.isEmpty()) {
      var signed = signature.toDataURL();
      payment.signature = signed
      payment.jerseyIssued = true
      payment.issuedDate = moment().format('YYYY-MM-DD')
      payment.jerseySize = this.state.size
      dispatch(actions.issueJersey(payment))
      browserHistory.push('m/jersey')
    }


  }

  render() {
    var {payments} = this.props
    var paymentKey = this.props.params.paymentKey
    var payment = _.find(payments, {key: paymentKey})
    var jerseySize = [
      '6', '8', '10', '14', '16', 'YS'
, 'S','YM', 'M', 'L', 'YL']
    var html = []
    var btnClass = "datebtn"
    jerseySize.map((size) => {
      html.push(<Button key={size} style={{borderRadius: '0', width: '25%', margin : '0px', height: '40px', backgroundColor: '#f5bb05', color: '#000000', border: '1px solid #ffffff', textShadow: 'none', fontWeight: '500'}} onClick={(e) => {this.handleSizeSelect(e, size)}}>{size}</Button>)
    })

  return (
    <div>
      <Row style={{padding: '10px', marginTop: '15px'}}>
        <Col md={12} xs={12}>
          <h4 style={{textAlign: 'center', textDecoration: 'underline'}}>Jersey Issue for {payment.childName}</h4>
        </Col>
      </Row>
      <Row style={{padding: '10px', marginTop: '5px'}}>
        <Col md={12} xs={12}>
          <h5>Select Jersey Size</h5>
          <ButtonGroup>
            {html}
          </ButtonGroup>
        </Col>
      </Row>
      <Row style={{ padding: '10px', marginTop: '15px'}}>
        <Col md={12} xs={12}>
          <h5>Parent/Guardian Signature</h5>
        </Col>
      </Row>
      <Row style={{height:'300px'}}>
        <Col md={12} xs={12}>
          <SignaturePad ref="mySignature"/>
        </Col>
      </Row>
      <Row style={{padding:'10px', marginTop: '15px'}}>
        <Col md={12} xs={12}>
            <button className="btn" style={{width: '50%', margin: '0'}} onClick={this.clear.bind(this)}>Clear</button>
            <button className="btn" style={{width: '50%', margin: '0'}} onClick={this.formSubmit.bind(this)}>Issue</button>
        </Col>
      </Row>
    </div>
  )
}
}


export default connect((state) => {return state;
})(JerseyIssueForm);
