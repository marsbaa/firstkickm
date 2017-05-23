import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon, Grid,Button, Badge} from 'react-bootstrap'
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
        if (moment(payment.date).year() === moment().year()) {
          if (payment.termsPaid !== undefined) {
            Object.keys(payment.termsPaid).map((termId) => {
              termsPaidHTML.push(<Badge key={key+termId} style={{fontSize: '8px', backgroundColor: '#f5bb05', color:'black'}}>T{termId}</Badge>)
            })
          }
        }
      })
    }
  termsPaidHTML = _.uniq(termsPaidHTML)

  return (
     <Grid >
       <Row style={{padding: '8px 5px', borderBottom: '1px solid #9a9a9a'}}>
         <Col xs={7} md={7} lg={7} style={{fontSize: '14px'}}>
           <Link to={"/m/students/edit/" + key} style={{color: 'black', marginRight: '4px'}}><Glyphicon style={{marginRight:'4px', fontSize: '12px'}} glyph='user' /><font className={gender}>{truncatedName}</font></Link>
           {termsPaidHTML}
         </Col>
         <Col xs={5} md={5} lg={5} style={{textAlign:'right'}}>
           <button className="innerbtn" onClick={(e) => this.props.onShow(e, key, childName)}><Glyphicon glyph="shopping-cart" /> </button>
           <Link to={"/m/payment/collection/" + key}><button className="innerbtn"><Glyphicon glyph="usd" /> </button></Link>
            <Link to={"/m/payment/history/" + key}><button className="innerbtn"><Glyphicon glyph="list-alt" /> </button></Link>
        </Col>
       </Row>
     </Grid>

    );
  }
}


export default connect((state) => {return state;
})(Payer);
