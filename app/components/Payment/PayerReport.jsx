import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon, Grid,Button} from 'react-bootstrap'
import {boy, girl} from 'styles.css'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'

class PayerReport extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      previousTerm : '',
      currentTerm : ''
    }
  }


  render() {
    var {dispatch} = this.props;
    var {childName, key, gender} = this.props.student;
    var amount = this.props.amount
    var truncatedName = _.truncate(childName, {
  'length': 28});

  return (
     <Grid key= {key}>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={8} md={8} style={{fontSize: '14px'}}>
           <Link to={"/m/payment/history/" + key} style={{color: 'black'}}><Glyphicon glyph="user" /> <font className={gender}>{truncatedName}</font></Link>
         </Col>
         <Col xs={4} md={4} style={{textAlign:'right'}}>
           {amount === 0 ? <p>Not Paid</p> : <p>{amount}</p>}
       </Col>
       </Row>
     </Grid>

    );
  }
}


export default connect((state) => {return state;
})(PayerReport);
