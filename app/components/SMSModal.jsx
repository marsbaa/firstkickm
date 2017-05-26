import React from 'react';
import {Modal, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'
import TermDatesSelector from 'TermDatesSelector'
import SMS from 'SMS'
var actions = require('actions');
var {connect} = require('react-redux');

class SMSModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      errorTermName: null,
      errorMessageTermName: ""
    }
    this.close = this.close.bind(this)
    this.send = this.send.bind(this)
  }

  close(e) {
    e.preventDefault();
    this.props.closeModal();
  }

  send(e) {
    e.preventDefault();
    var {dispatch, contacts} = this.props;
    var msg = encodeURI(document.getElementById('message').value)
    msg = '&msg='+msg+'&dstno='+contacts
    SMS.sendSMS(msg)
    this.props.closeModal();
  }


  render() {
     var { title, message } = this.props;

     return (
       <Modal show={this.props.showModal} onHide={this.close}>
         <Modal.Header closeButton>
           <Modal.Title>{title}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <h6>Message to Send</h6>
           <FormControl id='message' componentClass="textarea" style={{height: message.split(/\r\n|\r|\n/).length*25, minHeight: '250px'}} defaultValue={decodeURIComponent(message)}/>
         </Modal.Body>
         <Modal.Footer>
           <Button onClick={this.close}>Close</Button>
           <Button onClick={this.send}>Send</Button>
         </Modal.Footer>
       </Modal>
     );
   }
}

export default connect((state) => {return state;
})(SMSModal);
