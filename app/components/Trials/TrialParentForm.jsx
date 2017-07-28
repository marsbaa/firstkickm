import React from 'react';
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Well,
  Checkbox
} from 'react-bootstrap';
import {
  updateParentName,
  updateContact,
  updateEmail,
  updateAddress,
  updatePostalCode,
  updateTC
} from 'actions';
import { connect } from 'react-redux';

class TrialParentForm extends React.Component {
  render() {
    const { parent, dispatch } = this.props;
    const { parentName, contact, email, address, postalCode, tc } = parent;
    return (
      <Row>
        <Col xs={12} md={12} lg={12}>
          <FormGroup>
            <ControlLabel>Parent's Name</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="parentName"
              type="text"
              placeholder="Enter Parent's Name"
              defaultValue={parentName}
              onChange={e => dispatch(updateParentName(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Mobile Number</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="contactNumber"
              type="text"
              placeholder="Enter Mobile Number"
              defaultValue={contact}
              onChange={e => dispatch(updateContact(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={email}
              onChange={e => dispatch(updateEmail(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Address</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="address"
              type="text"
              placeholder="Enter Address"
              onChange={e => dispatch(updateAddress(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Postal Code</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="postalcode"
              type="text"
              placeholder="Enter Postal Code"
              onChange={e => dispatch(updatePostalCode(e.target.value))}
            />
          </FormGroup>
        </Col>
        <Col md={12} xs={12}>
          <Well>
            <FormGroup>
              <Checkbox
                name="termConditions"
                style={{ marginRight: '5px' }}
                checked={tc}
                onChange={e => dispatch(updateTC(tc))}
              >
                I agree to the terms & conditions set out by First Kick Academy
              </Checkbox>
              {this.tcCheck}
            </FormGroup>
          </Well>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    parent: state.parent
  };
}

export default connect(mapStateToProps)(TrialParentForm);
