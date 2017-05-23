import ReactDomServer from 'react-dom/server'
import React from 'react'
import {Grid, Row, Col, Image, Table, Well} from 'react-bootstrap'
import moment from 'moment'

module.exports = {
  render: function(payment) {
  var html = ReactDomServer.renderToStaticMarkup(React.createElement(Root, payment))
  return html;
  }
}

class Root extends React.Component{
  render() {
    var html = []
    var chequeHTML = []
    var paymentMethod = this.props.paymentMethod;
    if (paymentMethod === 'Cheque') {
      paymentMethod = paymentMethod + " #"+this.props.chequeNumber
      chequeHTML.push(<i key='chequehtml' style={{fontSize: '10px'}}>Note: Receipt will only be valid if cheque is cleared by bank</i>)
    }
    var paymentDetail = this.props
      html.push(<Row key={paymentDetail.childKey} style={{marginLeft: '30px'}}>
        <Col xs={8} md={8}><p style={{fontWeight: '800', textDecoration: 'underline'}}>{paymentDetail.childName}</p></Col></Row>)
    html.push(
            <Row key={paymentDetail.paymentDescription} style={{lineHeight: '12px', margin: '15px 30px'}}>
              <Col xs={8} md={8}><b>{paymentDetail.paymentDescription}</b></Col>
              <Col xs={4} md={4} style={{textAlign: 'right'}}>{paymentDetail.total}</Col>
            </Row>
            )


     html.push(
       <Row key='total' style={{lineHeight: '12px', margin: '15px 30px'}}>
         <Col xs={12} md={12}><hr/></Col>
         <Col xs={5} md={5}></Col>
         <Col xs={7} md={7} style={{textAlign: 'right'}}><b style={{color: '#555', fontSize:'16px', textAlign:'right'}}>Total : ${paymentDetail.total}</b></Col>
       </Row>
     )


    return (
      <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
            <title>First Kick Academy - Payment Receipt</title>
        </head>
      <body>
        <div style={{marginTop: '15px'}}>
          <Grid style={{padding: '20px 30px', border: '1px solid #eee', color: '#555', maxWidth: '600px', margin: 'auto',boxShadow:'0 0 10px rgba(0, 0, 0, .15)'}}>
            <Row>
              <Col xs={7} md={7}>
              <Image src="http://www.fka.sg/wp-content/uploads/2014/11/logo.png" height="60px"/>
              </Col>
              <Col xs={5} md={5} style={{textAlign: 'right', paddingRight:'20px'}}>
                <h4 style={{marginTop: '10px', marginBottom: '0px'}}>RECEIPT</h4>
              <font style={{fontSize: '10px' }}>Date : {moment().format("D MMM YYYY")}</font>
              </Col>
            </Row>
            <Row style={{marginTop: '30px'}}>
              <Col md={12} xs={12}>
                <p style={{paddingLeft: '20px'}}>
                  <b>First Kick Academy</b><br/>
                  1 Orchid Club Road #01-37<br/>
                  Orchid Country Club<br/>
                  Singapore 769162
                </p>
              </Col>
            </Row>
            <Row style={{margin: '10px 15px', backgroundColor: '#555', paddingLeft: '10px'}}>
              <Col md={12} xs={12} >
                <h5 style={{color: '#ffffff', fontSize: '15px', padding: '3px 0px'}}>Payment Method</h5>
              </Col>
            </Row>
            <Row style={{marginLeft: '30px'}}>
              <Col md={12} xs={12}>
                <p>
                  {paymentMethod}<br/>
                {chequeHTML}
                </p>
              </Col>
            </Row>
            <Row style={{margin: '10px 15px', backgroundColor: '#555', paddingLeft: '10px'}}>
              <Col md={12} xs={12} >
                <h5 style={{color: '#ffffff', fontSize: '15px', padding: '3px 0px'}}>Payment Details</h5>
              </Col>
            </Row>
            {html}
            <Well style={{marginTop: '20px', fontSize: '12px'}}>
              <b style={{textAlign: 'center', fontSize: '14px'}}>Thank you for joining First Kick Academy!</b><br/>
            <ul style={{marginTop: '10px'}}>
              <li>Please keep this receipt for future reference </li>
              <li>Term Fees are non refundable unless for Long Term Injury (3 weeks or more)</li>
              <li>Term Fees are non transferable</li>
              <li>If you have not paid for a session but would wish to attend it, please do make a payment of $45 cash to our administrator at the centre.</li>
              <li>If there are any dispute of the receipt please email to contact@fka.sg</li>
            </ul>
            </Well>
          </Grid>
        </div>
      </body>
      </html>
    )
  }
}
