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

  componentWillMount(){
    var {payments} = this.props
    var paymentKey = this.props.params.paymentKey
    var payment = _.find(payments, {key: paymentKey})
    this.setState({size: payment.size})
  }

  render() {
    var {payments} = this.props
    var paymentKey = this.props.params.paymentKey
    var payment = _.find(payments, {key: paymentKey})
    var jerseySize = [
      '6', '8', '10', '14', '16', 'YS'
, 'S','YM', 'M', 'L', 'YL']
    var html = []

    jerseySize.map((size) => {
      html.push(<Button key={size} className="datebtn" active={this.state.size === size}  style={{borderRadius: '0', width: '25%', margin : '0px', height: '40px'}} onClick={(e) => {this.handleSizeSelect(e, size)}}>{size}</Button>)
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
        <Col md={6} xs={6}>
            <button className="submitbtn" onClick={this.clear.bind(this)}>Clear</button>
        </Col>
        <Col md={6} xs={6}>
          <button className="submitbtn" onClick={this.formSubmit.bind(this)}>Issue</button>
        </Col>
      </Row>
    </div>
  )
}
}


export default connect((state) => {return state;
})(JerseyIssueForm);
