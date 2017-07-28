import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { RadioGroup, Radio } from 'react-radio-group';
import find from 'lodash/find';
import CentreSelector from 'CentreSelector';
import TimeDaySelector from 'TimeDaySelector';
import TermDateSelector from 'TermDateSelector';
import moment from 'moment';
import {
  getAllCalendarKeys,
  getAllCalendarDates,
  getAllClassTimeDays
} from 'helper';
import { addTrial } from 'actions';
import { browserHistory } from 'react-router';

class TrialAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trial: {
        venueId: props.venueId
      }
    };
    this.generateFormInput = this.generateFormInput.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  generateFormInput(label, id, type) {
    return (
      <FormGroup>
        <ControlLabel>
          {label}
        </ControlLabel>
        <FormControl
          style={{ marginBottom: '10px' }}
          id={id}
          type={type}
          placeholder={'Enter ' + label}
          onChange={e => {
            this.setState({
              trial: {
                ...this.state.trial,
                [id]: e.target.value
              }
            });
          }}
        />
      </FormGroup>
    );
  }

  onFormSubmit() {
    const { dispatch } = this.props;
    dispatch(actions.addTrial(this.state.trial));
    browserHistory.push(`/m/trials`);
  }

  render() {
    const { centres, calendars } = this.props;
    const { venueId, dateOfTrial } = this.state.trial;
    const centre = find(centres, { id: venueId });
    let ageGroup;

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
        <Row>
          <Col xs={12} md={12} lg={12}>
            <CentreSelector
              venueId={venueId}
              handleChange={vId => {
                this.setState({
                  trial: {
                    ...this.state.trial,
                    venueId: vId
                  }
                });
              }}
            />
            <TimeDaySelector
              classTimeDays={classTimeDays}
              handleChange={(time, day) => {
                this.setState({
                  trial: {
                    ...this.state.trial,
                    timeOfTrial: time
                  }
                });
              }}
            />
            <TermDateSelector
              calendarDates={calendarDates}
              dateOfTrial={dateOfTrial}
              handleChange={dot => {
                this.setState({
                  trial: {
                    ...this.state.trial,
                    dateOfTrial: dot
                  }
                });
              }}
            />
            {this.generateFormInput("Child's Name", 'childName', 'text')}
            {this.generateFormInput('Mobile Number', 'contact', 'text')}
            {this.generateFormInput(
              'Date of Birth (YYYY-MM-DD)',
              'dateOfBirth',
              'text'
            )}
            {this.generateFormInput(
              'Medical Condition',
              'medicalCondition',
              'textarea'
            )}
            {this.generateFormInput('Email', 'email', 'text')}
            {this.generateFormInput("Parent's Name", 'parentName', 'text')}
            <RadioGroup
              name="gender"
              selectedValue={'boy'}
              onChange={value => {
                this.setState({
                  trial: {
                    ...this.state.trial,
                    gender: value
                  }
                });
              }}
            >
              <label>
                <Radio value="boy" />Boy
              </label>{' '}
              <label>
                <Radio value="girl" />Girl
              </label>
            </RadioGroup>
            <button
              className="submitbtn"
              style={{ width: '100%', margin: '0' }}
              onClick={this.onFormSubmit}
            >
              Add Trial Profile
            </button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    calendars: state.calendars,
    centres: state.centres,
    venueId: state.selection.id
  };
}
export default connect(mapStateToProps)(TrialAddForm);
