import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateJoining, updateRegister } from 'actions';
import {
  Panel,
  Grid,
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Radio,
  Checkbox,
  Button,
  Modal
} from 'react-bootstrap';
import find from 'lodash/find';
import { getAgeGroup, getCentreKey } from 'helper';

class OpenhouseRegisterChildForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCentre: '',
      trialDate: '',
      notJoining: false,
      showModal: false,
      calendarKey: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  componentWillMount() {
    var { centres } = this.props;
    var trial = this.props.trial;
    this.setState({
      selectedCentre: find(centres, { name: trial.centreName }).key
    });
    this.setState({ trialDate: trial.dateOfTrial });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleChange(e) {
    var { dispatch } = this.props;
    var { id } = this.props.trial;
    this.setState({
      notJoining: this.state.notJoining === true ? false : true
    });
    dispatch(updateJoining(id));
  }

  centreSelect(e) {
    e.preventDefault();
    this.setState({
      selectedCentre: e.target.value
    });
  }

  timeSelect(e) {
    e.preventDefault();
    var { centres } = this.props;
    var centre = centres[this.state.selectedCentre];

    Object.keys(centre.classes).forEach(classID => {
      var cla = centre.classes[classID];
      var classTime = cla.startTime + ' - ' + cla.endTime;
      var classTimeDay = classTime + ' (' + _.capitalize(cla.day) + ')';
      if (classTimeDay === e.target.value) {
        this.setState({ calendarKey: cla.calendarKey });
      }
    });
  }

  trialDateSelect(e) {
    e.preventDefault();
    this.setState({
      trialDate: e.target.value
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    var { dispatch } = this.props;
    var { key } = this.props.trial;
    var classTimeSelector = document.getElementById('timeSlotSelect');
    var classTimeDay =
      classTimeSelector.options[classTimeSelector.selectedIndex].text;
    var init = classTimeDay.indexOf('(');
    var fin = classTimeDay.indexOf(')');
    var classDay = classTimeDay.substr(init + 1, fin - init - 1);
    var trial = {
      key,
      childName: document.getElementById('childName').value,
      gender: document.getElementById('boy').checked ? 'boy' : 'girl',
      dateOfBirth: document.getElementById('dateOfBirth').value,
      dateOfTrial: document.getElementById('trialDateSelect').value,
      venueId: document.getElementById('centreSelect').value.toString(),
      currentClassTime: document.getElementById('timeSlotSelect').value,
      currentClassDay: classDay,
      medicalCondition: document.getElementById('medicalCondition').value
    };
    dispatch(updateRegister(trial));
    this.open();
  }

  render() {
    var { centres, ageGroup, calendars } = this.props;
    var trial = this.props.trial;

    var childAgeGroup;
    if (trial.dateOfBirth !== undefined) {
      childAgeGroup = getAgeGroup(ageGroup, trial.dateOfBirth);
    } else {
      const { age } = trial;
      ageGroup.map(group => {
        if (age >= group.minAge && age <= group.maxAge) {
          childAgeGroup = group.name;
          if (childAgeGroup === 'U8B') {
            childAgeGroup = 'U8';
          }
        }
      });
    }

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
          {centre.name}
        </option>
      );
    });

    //Class TimeSlots
    var classTimeSlots = [];
    let time, cKey;

    classTimeSlots.push(
      <option key="0" value="0">
        select
      </option>
    );
    var centre = centres[this.state.selectedCentre];
    Object.keys(centre.classes).forEach(classID => {
      var { ageGroup, startTime, endTime, day, calendarKey } = centre.classes[
        classID
      ];
      if (ageGroup === childAgeGroup) {
        var classTime = startTime + ' - ' + endTime;
        var classTimeDay = classTime + ' (' + day + ')';
        if (
          startTime === trial.startTime &&
          day === moment(this.state.trialDate).format('dddd')
        ) {
          time = classTime;
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

    var calendar = calendars[cKey];
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

    var formHTML = [];
    if (!this.state.notJoining) {
      formHTML.push(
        <Grid key={trial.key}>
          <Row style={{ padding: '10px' }}>
            <Col xs={12} md={10} lg={11}>
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
                <Radio
                  id="boy"
                  value="boy"
                  inline
                  name="gender"
                  defaultChecked={trial.gender === 'boy' ? true : false}
                >
                  Boy
                </Radio>{' '}
                <Radio
                  id="girl"
                  value="girl"
                  inline
                  name="gender"
                  defaultChecked={trial.gender === 'girl' ? true : false}
                >
                  Girl
                </Radio>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Date of Birth</ControlLabel>
                <FormControl
                  style={{ marginBottom: '10px' }}
                  id="dateOfBirth"
                  type="text"
                  placeholder="Enter Date of Birth"
                  defaultValue={trial.dateOfBirth}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Selected Centre</ControlLabel>
                <FormControl
                  id="centreSelect"
                  componentClass="select"
                  placeholder="select"
                  defaultValue={this.state.selectedCentre}
                  onChange={this.centreSelect.bind(this)}
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
                  defaultValue={time}
                  onChange={this.timeSelect.bind(this)}
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
                  defaultValue={trial.dateOfTrial}
                  onChange={this.trialDateSelect.bind(this)}
                >
                  {trialDateOptions}
                </FormControl>
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
            </Col>
          </Row>

          <Row style={{ padding: '0px 10px', marginBottom: '30px' }}>
            <Col xs={12} md={10} lg={11}>
              <button
                className="submitbtn"
                onClick={this.onFormSubmit.bind(this)}
              >
                Update Child's Details
              </button>
            </Col>
          </Row>
        </Grid>
      );
    } else {
      formHTML.push(
        <Row key={trial.key}>
          <Col md={12}>
            {trial.childName} is not joining
          </Col>
        </Row>
      );
    }

    return (
      <Panel
        header={
          <Row>
            <Col xs={7} md={7}>
              <ControlLabel>Child's Details</ControlLabel>
            </Col>
            <Col xs={5} md={5} style={{ textAlign: 'right' }}>
              <Checkbox
                name="checkJoining"
                onChange={this.handleChange}
                checked={this.state.notJoining}
                style={{ margin: '0px' }}
              >
                Not Joining
              </Checkbox>
            </Col>
          </Row>
        }
      >
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>Done</Modal.Header>
          <Modal.Body>Child Details Updated</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
        {formHTML}
      </Panel>
    );
  }
}

function mapStateToProps(state) {
  return {
    centres: state.centres,
    ageGroup: state.ageGroup,
    calendars: state.calendars
  };
}

export default connect(mapStateToProps)(OpenhouseRegisterChildForm);
