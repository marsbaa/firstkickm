import React from 'react';
import { connect } from 'react-redux';
import { Panel, Row, Col, Checkbox, ControlLabel } from 'react-bootstrap';
import TrialRegChildForm from 'TrialRegChildForm';
import { updateJoining } from 'actions';

class TrialRegChildPanel extends React.Component {
  render() {
    const { dispatch, id } = this.props;
    const { notJoining } = this.props.register[id];
    return (
      <Panel
        style={{ marginTop: '20px' }}
        header={
          <Row>
            <Col xs={7} md={7}>
              <ControlLabel>Child's Details</ControlLabel>
            </Col>
            <Col xs={5} md={5} style={{ textAlign: 'right' }}>
              <Checkbox
                name="checkJoining"
                onChange={e => dispatch(updateJoining(notJoining, id))}
                checked={notJoining}
                style={{ margin: '0px' }}
              >
                Not Joining
              </Checkbox>
            </Col>
          </Row>
        }
      >
        {notJoining
          ? <Row>
              <Col xs={12} md={12} lg={12}>
                Not joining
              </Col>
            </Row>
          : <TrialRegChildForm id={id} />}
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  return {
    register: state.register
  };
}

export default connect(mapStateToProps)(TrialRegChildPanel);
