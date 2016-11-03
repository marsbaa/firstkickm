import React from 'react';
import {Jumbotron, Col, Image} from 'react-bootstrap';

export var Quote = React.createClass({
  render: function() {
    return (
      <Jumbotron style={{backgroundColor: '#f5bd00', paddingTop: '40px', overflow: 'auto'}}>
          <Col xs={1} md={1} />
          <Col xs={10} md={10}>
             <table width="100%">
              <tr>
                <td width="10%" style={{verticalAlign: 'top'}}><Image src="images/quoteLeft.png" responsive/></td>
                <td width="5%"></td>
                <td width="70%">  <p style={{textAlign: 'center'}}>Tell me and I forget. Teach me and I remember. Involve me and I learn.
                  </p>
                </td>
                <td width="5%"></td>
                <td width="10%" style={{verticalAlign: 'bottom'}}><Image src="images/quoteRight.png" responsive/></td>
              </tr>
              <tr>
                <td width="10%"></td>
                <td width="5%"></td>
                <td width="70%"><p style={{textAlign: 'center', fontSize:'90%', fontWeight: '600'}}>- Benjamin Franklin</p></td>
                <td width="5%"></td>
                <td width="10%"></td>
              </tr>
            </table>
          </Col>
          <Col xs={1} md={1} />
      </Jumbotron>
    )
  }
});

export default (Quote);
