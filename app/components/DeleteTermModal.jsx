import React from 'react';
import {Modal, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'
import TermDatesSelector from 'TermDatesSelector'
var actions = require('actions');
var {connect} = require('react-redux');

export var DeleteTermModal = React.createClass({
  getInitialState: function() {
    return {
      errorTermName: null,
      errorMessageTermName: ""
    };
  },

  close(e) {
    e.preventDefault();
    this.props.closeModal();
  },

  delete(e) {
    e.preventDefault();
    var {dispatch} = this.props;
    dispatch(actions.deleteTerm(this.props.centreKey, this.props.calendarKey));
    this.props.closeModal();
  },


  render: function () {

     return (
       <Modal show={this.props.showModal} onHide={this.close}>
         <Modal.Header closeButton>
           <Modal.Title>Delete Term</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <h6>Are you sure you want to delete Term?</h6>
         </Modal.Body>
         <Modal.Footer>
           <Button onClick={this.close}>Close</Button>
           <Button onClick={this.delete}>Delete</Button>
         </Modal.Footer>
       </Modal>
     );
   }
});

export default connect((state) => {return state;
})(DeleteTermModal);
