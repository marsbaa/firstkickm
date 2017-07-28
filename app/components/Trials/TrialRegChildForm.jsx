import React from 'react';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import find from 'lodash/find';
import { RadioGroup, Radio } from 'react-radio-group';
import CentreSelector from 'CentreSelector';
import TimeDaySelector from 'TimeDaySelector';
import TermDateSelector from 'TermDateSelector';
import { connect } from 'react-redux';
import {
  getAgeGroup,
  getAllCalendarKeys,
  getAllCalendarDates,
  getAllClassTimeDays
} from 'helper';
import {
  updateChildName,
  updateGender,
  updateDateOfBirth,
  updateDateOfTrial,
  updateMedical,
  updateCentreId,
  updateClassTimeDay
} from 'actions';
import moment from 'moment';

class TrialRegChildForm extends React.Component {
  render() {
    const { register, id, dispatch, centres, calendars } = this.props;
    const {
      childName,
      gender,
      dateOfBirth,
      venueId,
      timeOfTrial,
      dateOfTrial,
      medicalCondition,
      currentClassTime,
      currentClassDay,
      ageGroup
    } = register[id];
    const centre = find(centres, { id: venueId });
    console.log(centre);

    //Get all term dates for Term Dates Selector
    const calendarKeys = getAllCalendarKeys(centre.classes, ageGroup);
    const calendarDates = getAllCalendarDates(calendars, calendarKeys);

    //Get all Time Days for TimeDaySelector
    const classTimeDays = getAllClassTimeDays(
      centre.classes,
      ageGroup,
      moment(dateOfTrial).format('dddd')
    );
    return (
      <Grid>
        <Row style={{ padding: '5px' }}>
          <Col xs={12} md={10} lg={11}>
            <FormGroup>
              <ControlLabel>Child's Name</ControlLabel>
              <FormControl
                id="childname"
                style={{ marginBottom: '10px' }}
                type="text"
                placeholder="Enter Child's Name"
                defaultValue={childName}
                onChange={e => dispatch(updateChildName(e.target.value, id))}
              />
            </FormGroup>
            <RadioGroup
              name={'gender' + id}
              selectedValue={gender}
              onChange={value => dispatch(updateGender(value, id))}
              style={{ marginBottom: '5px' }}
            >
              <ControlLabel
                style={{ marginRight: '15px', marginBottom: '15px' }}
              >
                <Radio value="boy" />Boy
              </ControlLabel>
              <ControlLabel>
                <Radio value="girl" />Girl
              </ControlLabel>
            </RadioGroup>
            <FormGroup>
              <ControlLabel>Date of Birth (YYYY-MM-DD)</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px' }}
                id="dateOfBirth"
                type="text"
                placeholder="Enter Date of Birth"
                defaultValue={dateOfBirth}
                onChange={e => {
                  let dob = moment(e.target.value).format('YYYY-MM-DD');
                  dispatch(updateDateOfBirth(dob, id));
                }}
              />
            </FormGroup>
            <CentreSelector
              venueId={venueId}
              handleChange={venueId => dispatch(updateCentreId(venueId, id))}
            />
            <TimeDaySelector
              classTimeDays={classTimeDays}
              timeDay={currentClassTime + ',' + currentClassDay}
              handleChange={(time, day) =>
                dispatch(updateClassTimeDay(time, day, id))}
            />
            <TermDateSelector
              calendarDates={calendarDates}
              dateOfTrial={dateOfTrial}
              handleChange={(time, day) =>
                dispatch(updateClassTimeDay(time, day, id))}
            />
            <FormGroup>
              <ControlLabel>Medical Condition</ControlLabel>
              <FormControl
                style={{ marginBottom: '10px', height: '90px' }}
                id="medicalCondition"
                componentClass="textarea"
                placeholder="Enter Medical Condition"
                defaultValue={medicalCondition}
                onChange={e => dispatch(updateMedical(e.target.value, id))}
              />
            </FormGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    register: state.register,
    centres: state.centres,
    calendars: state.calendars
  };
}

export default connect(mapStateToProps)(TrialRegChildForm);
