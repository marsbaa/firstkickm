import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon, Grid,Button} from 'react-bootstrap'
import {boy, girl} from 'styles.css'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'

class Payer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      previousTerm : '',
      currentTerm : ''
    }
  }


  render() {
    var {dispatch} = this.props;
    var {childName, key, gender, payments} = this.props.student;
    var truncatedName = _.truncate(childName, {
  'length': 28});
    var termsPaidHTML = []
    if (payments !== undefined) {
      Object.keys(payments).map((paymentId) => {
        var payment = payments[paymentId]
        if (payment.termsPaid !== undefined) {
          Object.keys(payment.termsPaid).map((termId) => {
            termsPaidHTML.push(<Button style={{padding: '2px' ,fontSize:'8px', backgroundColor: '#ffc600', color: '#656565'}} key={paymentId+termId} bsSize="xsmall">T{termId}<Glyphicon glyph="ok" /></Button>)
          })
        }
      })
    }

  return (
     <Grid key= {key}>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={9} md={9} style={{fontSize: '14px'}}>
           <Glyphicon glyph="user" /> <font className={gender}>{truncatedName}</font>
           {termsPaidHTML}
         </Col>
         <Col xs={3} md={3} style={{textAlign:'right'}}>
           <Link to={"/m/payment/collection/" + key}><button className="innerbtn"><Glyphicon glyph="usd" /> </button></Link>
         </Col>
       </Row>
     </Grid>

    );
  }
}


export default connect((state) => {return state;
})(Payer);
