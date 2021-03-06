import React from 'react';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import filter from 'lodash/filter'
import { RadioGroup, Radio } from 'react-radio-group';
import CentreSelector from 'CentreSelector';
import TimeDaySelector from 'TimeDaySelector';
import TermDateSelector from 'TermDateSelector';
import { connect } from 'react-redux';
import {
  getAllCalendarKeys,
  getAllCalendarDates,
  getAllClassTimeDays,
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
    const { register, id, dispatch, calendars, classes } = this.props;
    const {
      childName,
      gender,
      dateOfBirth,
      venueId,
      dateOfTrial,
      medicalCondition,
      currentClassTime,
      currentClassDay,
      ageGroup
    } = register[id];
    //Get all term dates for Term Dates Selector
    const calendarKeys = getAllCalendarKeys(classes, ageGroup);
    const calendarDates = getAllCalendarDates(calendars, calendarKeys);

    //Get all Time Days for TimeDaySelector
    const classTimeDays = getAllClassTimeDays(
      classes,
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
              handleChange={date => {
                dispatch(updateDateOfTrial(date, id));
              }}
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
    calendars: state.calendars,
    classes: filter(state.classes, { centreKey: state.selection.key })
  };
}

export default connect(mapStateToProps)(TrialRegChildForm);
