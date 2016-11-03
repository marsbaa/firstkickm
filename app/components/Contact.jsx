import React from 'react';
import {Jumbotron, FieldGroup, FormControl,Col, Button} from 'react-bootstrap';
import SendMail from 'SendMail';
import btn from 'styles.css'

export var Contact = React.createClass({
  onFormSubmit: function(e) {
    e.preventDefault();
    var html = `
      <div>
        <h4>Name: ${document.getElementById("name").value}</h4>
        <h4>Email: ${document.getElementById("email").value}</h4>
        <h4>Message: ${document.getElementById("message").value}</h4>
      </div>
    `;
    try {
      var D_EMAIL = process.env.D_EMAIL;
      SendMail.mail(D_EMAIL, 'Enquiries from Beetot.com', html);
    } catch (e) {
    }

  },

  render: function() {
    return (
    <Jumbotron style={{marginBottom: '0'}}>
      <h3 style={{textAlign: 'center'}}>CONTACT US</h3>
      <div className= "container" style={{backgroundColor: '#f1f2f2', paddingTop: '40px'}}>
        <form onSubmit={this.onFormSubmit}>
          <Col md={6} style={{paddingTop: '15px'}}>
            <FormControl
            id="name"
            type="text"
            placeholder="Your Name"
          />
          </Col>
          <Col md={6} style={{paddingTop: '15px'}}>
            <FormControl
            id="email"
            type="text"
            placeholder="Your Email"
          />
          </Col>
          <Col md={12} style={{paddingTop: '15px'}}>
            <FormControl id="message" componentClass="textarea" placeholder="Your Message" style={{height: '120px'}}/>
          </Col>
          <Col md={12} style={{paddingTop: '15px', textAlign: 'center'}}>
            <button className="btn btn-primary">SEND</button>
          </Col>
        </form>
      </div>
    </Jumbotron>

  )
  }
});

export default (Contact);
