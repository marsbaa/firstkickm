import React from 'react'
var {connect} = require('react-redux')
import {Grid, Row, Col, Glyphicon, ButtonGroup, Button} from 'react-bootstrap'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import SignaturePad from 'react-signature-pad'
import "react-signature-pad/style.css"


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

  render() {
    var jerseySize = [
      '6', '8', '10', '14', '16', 'YS'
, 'S','YM', 'M', 'L', 'YL']
    var html = []
    var btnClass = "datebtn"
    jerseySize.map((size) => {
      html.push(<Button key={size} style={{borderRadius: '0', width: '25%', margin : '0px', height: '40px'}} onClick={(e) => {this.handleSizeSelect(e, size)}}>{size}</Button>)
    })

  return (
    <div>
      <Row style={{padding: '10px'}}>
        <Col md={12} xs={12}>
          <ButtonGroup>
            {html}
          </ButtonGroup>
        </Col>
      </Row>
      <Row style={{height:'700px'}}>
        <Col md={12} xs={12}>
          <SignaturePad clearButton="true"  />
        </Col>
      </Row>
    </div>
  )
}
}


export default connect((state) => {return state;
})(JerseyIssueForm);
