import React from 'react'
import PayerNotPaid from 'PayerNotPaid'
import {Row, Col} from 'react-bootstrap'


class PaymentClassList extends React.Component {

  render() {

     return (
       <div>
         <Row key={this.props.title} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
            <Col xs={12} md={12}>
              <h5>{this.props.title}</h5>
           </Col>
          </Row>
          {Object.keys(this.props.group).map((id)=> {
            return <PayerNotPaid key={id} student={this.props.group[id]}/>
          })}
       </div>
     );
   }
  }

 export default PaymentClassList
