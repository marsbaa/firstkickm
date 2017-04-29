import React from 'react'
import _ from 'lodash'
import {ListGroup, ListGroupItem, Button, Glyphicon} from 'react-bootstrap'
import moment from 'moment'
var actions = require('actions')
var {connect} = require('react-redux')

class PaymentDetails extends React.Component {

  render() {
    var {payment, centres} = this.props
    var centre = _.find(centres, {id : payment.centreId})
    var termspaidhtml = []
    var termsamounthtml = []
    if (payment.termsPaid !== undefined) {
      Object.keys(payment.termsPaid).map((termId) => {
        termspaidhtml.push(<Button style={{padding: '2px' ,fontSize:'8px', backgroundColor: '#ffc600', color: '#656565'}} key={payment.key+termId} bsSize="xsmall">T{termId}<Glyphicon glyph="ok" /></Button>)
        var cost = 0
        var term = payment.termsPaid[termId]
        switch (_.size(term)) {
          case 8:
            cost = 300;
            break;
          case 7:
            cost = 270;
            break;
          case 6:
            cost = 240;
            break;
          case 5:
            cost = 220;
            break;
          default:
            cost = term.length * 45;
            break;
        }
        termsamounthtml.push(<p key={"amount"+termId} style={{margin : '0px'}}>Term {termId} Fees : ${cost}</p>)
    })
  }



   return (
     <ListGroup fill>
       <ListGroupItem>Centre : {centre.name}</ListGroupItem>
       {_.isEmpty(termspaidhtml)? null : <ListGroupItem>Terms Paid : {termspaidhtml}</ListGroupItem> }
       {
           payment.termsPaid !== undefined ?
             <ListGroupItem>{Object.keys(payment.termsPaid).map((termId) => {
               var term = payment.termsPaid[termId]
               return <p key={"TermDates"+termId} style={{fontSize: '9px', margin: '0px'}}>T{termId} ({_.size(term)} sessions): {Object.keys(term).map((id)=>{
                 return id < _.size(term)-1 ? <i key={term[id].date}>{moment(term[id].date).format("DD MMM YY")}, </i> : <i key={term[id].date}>{moment(term[id].date).format("DD MMM YY")}</i>
               })}</p>
           })}</ListGroupItem> : ""
       }
     {_.isEmpty(termsamounthtml) ? null : <ListGroupItem>{termsamounthtml}</ListGroupItem> }
     {payment.earlyBird ? <ListGroupItem>Early Bird: ($20)</ListGroupItem> : null}
     {payment.registration ? <ListGroupItem>Registration: $80</ListGroupItem> : null}
     {payment.prorate !== undefined ? <ListGroupItem>Pro-rate: (${payment.prorate})</ListGroupItem> : null}
     {payment.siblingDiscount ? <ListGroupItem>Sibling Discount: (${payment.siblingDiscountAmount})</ListGroupItem> : null}
     <ListGroupItem>Total : ${payment.total}</ListGroupItem>
     </ListGroup>

   );
 }
 }

 export default connect((state) => {return state;
})(PaymentDetails);
