import React from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap';
import { addDeposit } from 'actions';

class TrialDepositModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: ''
    };
  }

  handleChange(e) {
    this.setState({
      amount: e.target.value
    });
  }

  formSubmit() {
    var { dispatch, id } = this.props;
    dispatch(addDeposit(this.state.amount, id));
    this.props.close();
  }

  render() {
    const { childName, close, show } = this.props;
    return (
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            Place Deposit for
            <br />
            <font style={{ fontSize: '14px', color: '#f5bb05' }}>
              {childName}
            </font>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>Amount</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="amount"
              type="text"
              placeholder="Enter Amount"
              onChange={this.handleChange.bind(this)}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" onClick={this.formSubmit.bind(this)}>
            Yes
          </Button>
          <Button bsSize="large" onClick={() => close}>No</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect()(TrialDepositModal);
