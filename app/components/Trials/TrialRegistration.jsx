import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Grid, Row, Col, Tabs, Tab, Glyphicon } from 'react-bootstrap';
import filter from 'lodash/filter';
import find from 'lodash/find';
import TrialRegChildTab from 'TrialRegChildTab';
import TrialParentForm from 'TrialParentForm';
import { addRegister, resetRegister, addParent, resetParent } from 'actions';
import { getAgeGroup, similarity } from 'helper';
import moment from 'moment';

class TrialRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    const { trials, dispatch, ageGroup } = this.props;
    const key = this.props.params.trialId;
    const trial = find(trials, { id: key });
    let payers = []
    payers.push(trial)
    let similarContact = filter(trials, {contact: trial.contact})
    similarContact.map(i => {
      if (i.id !== key && similarity(i.childName, trial.childName) < 0.75) {
        payers.push(i)
      }
    })
    let register = {};
    payers.map(payer => {
      payer.notJoining = false;
      payer.startDate = payer.dateOfTrial;
      payer.currentClassDay = _.capitalize(
        moment(payer.dateOfTrial).format('dddd')
      );
      payer.currentClassTime = payer.timeOfTrial;
      payer.ageGroup = getAgeGroup(ageGroup, payer.dateOfBirth);
      register[payer.id] = payer;
    });
    const parent = {
      parentName: trial.parentName,
      contact: trial.contact,
      email: trial.email,
      tc: false
    };
    dispatch(addRegister(register));
    dispatch(addParent(parent));
  }

  handleSelect(key) {
    this.setState({ key });
  }

  render() {
    const { register, tc } = this.props;
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12} lg={12}>
            <Tabs
              style={{ marginTop: '5px', fontWeight: '600' }}
              activeKey={this.state.key}
              onSelect={this.handleSelect}
              id="registrationTab"
            >
              {Object.keys(register).map((payerKey, index) => {
                const { childName } = register[payerKey];
                return (
                  <TrialRegChildTab
                    eventKey={index}
                    title={childName}
                    key={payerKey}
                    id={payerKey}
                  />
                );
              })}
            </Tabs>
          </Col>
        </Row>

        <TrialParentForm />
        <button
          className="submitbtn"
          onClick={() => {
            if (tc) {
              browserHistory.push('/m/trials/payment');
              //var msg = '&msg=Please%20save%20this%20number%2091010666&dstno=6590364283';
              //SMS.sendSMS(msg)
            }
          }}
        >
          Next Step (Payment) <Glyphicon glyph="chevron-right" />
        </button>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    trials: filter(state.trials, { venueId: state.selection.id }),
    register: state.register,
    ageGroup: state.ageGroup,
    tc: state.parent.tc
  };
}

export default connect(mapStateToProps)(TrialRegistration);
