import React from 'react';
import moment from 'moment';
import ChildForm from 'OpenhouseRegisterChildForm';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { addRegister, startCalendars, updateParentDetails } from 'actions';
import {
  Grid,
  Panel,
  Row,
  Col,
  Well,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Glyphicon,
  Tabs,
  Tab
} from 'react-bootstrap';
import SMS from 'SMS';

class OpenhouseRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCentre: '',
      trialDate: '',
      value: false,
      payers: []
    };
    this.handleTC = this.handleTC.bind(this);
  }

  handleTC() {
    this.setState({
      value: this.state.value === false ? true : false
    });
  }

  centreSelect(e) {
    e.preventDefault();
    this.setState({
      selectedCentre: e.target.value
    });
  }

  trialDateSelect(e) {
    e.preventDefault();
    this.setState({
      trialDate: e.target.value
    });
  }

  tcCheck(e) {
    e.preventDefault();
    if (this.state.value === false) {
      return (
        <div>
          <label style={{ color: 'red', fontSize: '10px' }}>
            Please agree to the Terms and Conditions before proceeding.{' '}
          </label>
        </div>
      );
    } else {
      return <div />;
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillMount() {
    var { dispatch, openhouse, selection, ageGroup } = this.props;
    var key = this.props.params.openhouseId;
    var trial = _.find(openhouse, { key: key });
    var payers = _.filter(openhouse, {
      contact: trial.contact,
      centreName: selection.name
    });
    payers = _.uniqBy(payers, 'childName');
    this.setState({ selectedCentre: selection.id });
    this.setState({ trialDate: trial.dateOfTrial });
    this.setState({ payers });

    payers.map(payer => {
      const { age } = payer;
      payer.joining = true;
      var childAgeGroup;
      ageGroup.map(group => {
        if (age >= group.minAge && age <= group.maxAge) {
          childAgeGroup = group.name;
          if (childAgeGroup === 'U8B') {
            childAgeGroup = 'U8';
          }
        }
      });
      Object.keys(selection.classes).forEach(classID => {
        var cla = selection.classes[classID];
        if (cla.ageGroup === childAgeGroup) {
          var classTime = cla.startTime + ' - ' + cla.endTime;
          var classTimeDay = classTime + ' (' + _.capitalize(cla.day) + ')';
          var day = moment(payer.dateOfTrial).format('dddd');
          if (cla.startTime === payer.startTime) {
            payer.currentClassDay = _.capitalize(cla.day);
            payer.currentClassTime = classTime;
            payer.ageGroup = childAgeGroup;
            payer.centre = selection.name;
          }
          if (payer.venueId === undefined) {
            payer.venueId = selection.id;
          }
        }
      });
    });
    dispatch(addRegister(payers));
  }

  onFormSubmit(e) {
    var { dispatch } = this.props;
    var parentDetails = {
      parentName: document.getElementById('parentName').value,
      contact: document.getElementById('contactNumber').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      postalcode: document.getElementById('postalcode').value
    };
    dispatch(updateParentDetails(parentDetails));
    browserHistory.push('/m/openhouse/payment');
  }

  render() {
    var payers = this.state.payers;
    var html = [];
    payers.map((payer, id) => {
      html.push(
        <Tab eventKey={id} key={payer.key} title={payer.childName}>
          <Row style={{ padding: '10px 20px' }}>
            <Col xs={12} md={12}>
              <ChildForm trial={payer} />
            </Col>
          </Row>
        </Tab>
      );
    });

    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <Tabs
              style={{ marginTop: '5px', fontWeight: '600' }}
              defaultActiveKey={0}
              id="uncontrolled-tab-example"
            >
              {html}
            </Tabs>
          </Col>
        </Row>
        <Row style={{ padding: '0px 45px' }}>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>Parent's Name</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px' }}
                id="parentName"
                type="text"
                placeholder="Enter Parent's Name"
                defaultValue={payers[0].name}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Mobile Number</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px' }}
                id="contactNumber"
                type="text"
                placeholder="Enter Mobile Number"
                defaultValue={payers[0].contact}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px' }}
                id="email"
                type="text"
                placeholder="Enter Email"
                defaultValue={payers[0].email}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Address</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px' }}
                id="address"
                type="text"
                placeholder="Enter Address"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Postal Code</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px' }}
                id="postalcode"
                type="text"
                placeholder="Enter Postal Code"
              />
            </FormGroup>
          </Col>
          <Col md={12} xs={12}>
            <Well>
              <FormGroup>
                <Checkbox
                  name="termConditions"
                  style={{ marginRight: '5px' }}
                  checked={this.state.value}
                  onChange={this.handleTC}
                >
                  I agree to the terms & conditions set out by First Kick
                  Academy
                </Checkbox>
                {this.tcCheck.bind(this)}
              </FormGroup>
            </Well>
            <button
              className="submitbtn"
              onClick={() => {
                if (this.state.value) {
                  this.onFormSubmit();
                  //var msg = '&msg=Please%20save%20this%20number%2091010666&dstno=6590364283';
                  //SMS.sendSMS(msg)
                }
              }}
            >
              Next Step (Payment) <Glyphicon glyph="chevron-right" />
            </button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    openhouse: state.openhouse,
    selection: state.selection,
    ageGroup: state.ageGroup
  };
}

export default connect(mapStateToProps)(OpenhouseRegister);
