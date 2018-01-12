import React from 'react'
import {Row, Col, Glyphicon} from 'react-bootstrap'
import {Link} from 'react-router'
import truncate from 'lodash/truncate'

const Jersey = ({student, paymentKey}) => {
  const {childName, childKey} = student;
    let truncatedName = truncate(childName, {
  'length': 28});

  return (
      <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
        <Col xs={9} md={9} style={{fontSize: '14px'}}>
          <Glyphicon glyph="user" /> {truncatedName}
        </Col>
        <Col xs={3} md={3} style={{textAlign:'right'}}>
          <Link to={"/m/jersey/issue/"+ paymentKey}><button className="innerbtn">Issue </button></Link>
        </Col>
      </Row>

  )
}


export default Jersey;
