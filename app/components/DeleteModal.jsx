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
    if (this.props.type === "class") {
      dispatch(actions.deleteClass(this.props.centreKey, this.props.deleteKey));
    }
    else if (this.props.type === "term") {
      dispatch(actions.deleteTerm(this.props.deleteKey));
    }
    this.props.closeModal();
  },


  render: function () {
     var type = this.props.type;

     return (
       <Modal show={this.props.showModal} onHide={this.close}>
         <Modal.Header closeButton>
           <Modal.Title>Delete {type}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <h6>Are you sure you want to delete {type}?</h6>
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