import ReactDomServer from 'react-dom/server'
import React from 'react'
import {Grid,Row, Col, Image, Table} from 'react-bootstrap'
import moment from 'moment'


class Root extends React.Component{
  render() {
    return (
      <div style={{marginTop: '15px'}}>
        <Grid style={{padding: '20px 30px', border: '1px solid #eee', color: '#555', maxWidth: '800px', margin: 'auto',boxShadow:'0 0 10px rgba(0, 0, 0, .15)'}}>
          <Row>
            <Col xs={12} md={12}>
              <Table style={{padding: '10px', border: '0px'}}>
                <tbody>
                  <tr>
                    <td style={{width: '70%'}}><Image src="http://www.fka.sg/wp-content/uploads/2014/11/logo.png" height="60px"/></td>
                    <td style={{width: '30%', textAlign: 'right'}}>
                      <h2 style={{marginBottom: '0px'}}>RECEIPT</h2>
                    Created on : {moment().format("D MMM YYYY")}
                    </td>
                  </tr>
                </tbody>
              </Table>
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
                Cash
              </p>
            </Col>
          </Row>
          <Row style={{margin: '10px 15px', backgroundColor: '#555', paddingLeft: '10px'}}>
            <Col md={12} xs={12} >
              <h5 style={{color: '#ffffff', fontSize: '15px', padding: '3px 0px'}}>Fees Breakdown</h5>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Root;
