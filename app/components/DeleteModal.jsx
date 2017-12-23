import React from 'react';
import {
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button
} from 'react-bootstrap';
import TermDatesSelector from 'TermDatesSelector';
import { deleteClass, deleteTerm } from 'actions';
import { connect } from 'react-redux';

class DeleteTermModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorTermName: null,
      errorMessageTermName: ''
    };
    this.close = this.close.bind(this);
    this.delete = this.delete.bind(this);
  }

  close(e) {
    e.preventDefault();
    this.props.closeModal();
  }

  delete(e) {
    e.preventDefault();
    var { dispatch, deleteKey, type } = this.props;
    if (type === 'class') {
      dispatch(deleteClass(deleteKey));
    } else if (type === 'calendar') {
      dispatch(deleteTerm(deleteKey));
    }
    this.props.closeModal();
  }

  render() {
    const type = this.props.type;
    return (
      <Modal show={this.props.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete {type}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>
            Are you sure you want to delete {type}?
          </h6>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
          <Button onClick={this.delete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect()(DeleteTermModal);
