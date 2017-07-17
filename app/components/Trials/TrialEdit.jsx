import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateTrial } from 'actions';
import {
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Radio
} from 'react-bootstrap';
import { getAgeGroup } from 'helper';
import find from 'lodash/find';

class TrialEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCentre: '',
      trialDate: ''
    };
    this.centreSelect = this.centreSelect.bind(this);
    this.trialDateSelect = this.trialDateSelect.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
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

  componentWillMount() {
    var key = this.props.params.trialId;
    var { trials, selection } = this.props;
    var trial = _.find(trials, { id: key });
    this.setState({ selectedCentre: selection.key });
    this.setState({ trialDate: trial.dateOfTrial });
  }

  componentDidMount() {
    var key = this.props.params.trialId;
    var { trials } = this.props;
    var trial = _.find(trials, { id: key });
    document.getElementById('boy').checked =
      trial.gender === 'boy' ? true : false;
    document.getElementById('girl').checked =
      trial.gender === 'girl' ? true : false;
  }

  onFormSubmit(e) {
    e.preventDefault();
    var key = this.props.params.trialId;
    var { trials } = this.props;
    var trial = _.find(trials, { id: key });
    var { dispatch, centres } = this.props;
    var trial = {
      id: key,
      childName: document.getElementById('childName').value,
      contact: document.getElementById('contactNumber').value,
      email: document.getElementById('email').value,
      gender: document.getElementById('boy').checked ? 'boy' : 'girl',
      dateOfBirth: document.getElementById('dateOfBirth').value,
      dateOfTrial: document.getElementById('trialDateSelect').value,
      venueId: centres[document.getElementById('centreSelect').value].id,
      timeOfTrial: document.getElementById('timeSlotSelect').value,
      parentName: document.getElementById('parentName').value,
      medicalCondition: document.getElementById('medicalCondition').value,
      attended: trial.attended === undefined ? false : trial.attended,
      attendedOn: trial.attended === undefined ? null : trial.attended
    };
    dispatch(updateTrial(trial));
    browserHistory.push(`/m/trials`);
  }

  render() {
    var key = this.props.params.trialId;
    var { trials, centres, ageGroup, calendars, selection } = this.props;
    var trial = _.find(trials, { id: key });
    //Centre List
    var centreOptions = [];
    centreOptions.push(
      <option key="0" value="0">
        select
      </option>
    );
    Object.keys(centres).map(centreKey => {
      var centre = centres[centreKey];
      centreOptions.push(
        <option key={centreKey} value={centreKey}>
          {_.upperFirst(centre.name)}
        </option>
      );
    });

    //Class TimeSlots
    let cKey = '';
    var childAgeGroup = getAgeGroup(ageGroup, trial.dateOfBirth);
    var classTimeSlots = [];
    classTimeSlots.push(
      <option key="0" value="0">
        select
      </option>
    );
    var centre = centres[this.state.selectedCentre];
    Object.keys(centre.classes).forEach(classID => {
      const { startTime, endTime, ageGroup, calendarKey, day } = centre.classes[
        classID
      ];
      if (ageGroup === childAgeGroup) {
        let classTime = startTime + ' - ' + endTime;
        let classTimeDay = classTime + ' (' + day + ')';
        let dayOfTrial = moment(this.state.trialDate).format('dddd');
        if (classTimeDay === trial.timeOfTrial + ' (' + dayOfTrial + ')') {
          cKey = calendarKey;
        }
        classTimeSlots.push(
          <option key={classTimeDay} value={classTime}>
            {classTimeDay}
          </option>
        );
      }
    });

    //Trial dates
    var trialDateOptions = [];
    trialDateOptions.push(
      <option key="0" value="0">
        select
      </option>
    );
    if (cKey === '') {
      cKey = find(calendars, { centreKey: selection.key }).key;
    }
    let calendar = calendars[cKey];
    Object.keys(calendar.terms).map(termId => {
      var term = calendar.terms[termId];
      term.map(dates => {
        var formattedDate = moment(dates).format('YYYY-MM-DD');
        trialDateOptions.push(
          <option key={formattedDate} value={formattedDate}>
            {formattedDate}
          </option>
        );
      });
    });

    return (
      <Row style={{ padding: '10px' }}>
        <Col md={6}>
          <FormGroup>
            <ControlLabel>Selected Centre</ControlLabel>
            <FormControl
              id="centreSelect"
              componentClass="select"
              placeholder="select"
              defaultValue={selection.key}
              onChange={this.centreSelect}
            >
              {centreOptions}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Selected Class Time</ControlLabel>
            <FormControl
              id="timeSlotSelect"
              componentClass="select"
              placeholder="select"
              defaultValue={trial.timeOfTrial}
            >
              {classTimeSlots}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Date of Trial</ControlLabel>
            <FormControl
              id="trialDateSelect"
              componentClass="select"
              placeholder="select"
              defaultValue={moment(trial.dateOfTrial).format('YYYY-MM-DD')}
              onChange={this.trialDateSelect}
            >
              {trialDateOptions}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Child's Name</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="childName"
              type="text"
              placeholder="Enter Child's Name"
              defaultValue={trial.childName}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Mobile Number</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="contactNumber"
              type="text"
              placeholder="Enter Mobile Number"
              defaultValue={trial.contact}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <ControlLabel>Date of Birth</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="dateOfBirth"
              type="text"
              placeholder="Enter Date of Birth (YYYY-MM-DD)"
              defaultValue={trial.dateOfBirth}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Medical Condition</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px', height: '90px' }}
              id="medicalCondition"
              componentClass="textarea"
              placeholder="Enter Medical Condition"
              defaultValue={trial.medicalCondition}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="email"
              type="text"
              placeholder="Enter Email"
              defaultValue={trial.email}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Parent's Name</ControlLabel>
            <FormControl
              style={{ marginBottom: '10px' }}
              id="parentName"
              type="text"
              placeholder="Enter Parent's Name"
              defaultValue={trial.parentName}
            />
          </FormGroup>
          <FormGroup>
            <Radio id="boy" value="boy" name="gender" inline>
              Boy
            </Radio>{' '}
            <Radio id="girl" value="girl" name="gender" inline>
              Girl
            </Radio>
          </FormGroup>
          <button
            className="btn"
            style={{ width: '100%', margin: '0' }}
            onClick={this.onFormSubmit}
          >
            Save Child Profile
          </button>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    trials: state.trials,
    centres: state.centres,
    ageGroup: state.ageGroup,
    calendars: state.calendars,
    selection: state.selection
  };
}

export default connect(mapStateToProps)(TrialEdit);
