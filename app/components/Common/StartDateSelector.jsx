import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Row,
  Col
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import moment from 'moment';

const StartDateSelector = props => {
  const { startDate, calendarDates } = props;
  console.log(startDate)
  console.log(calendarDates)
  return (
    <Row style={{ marginBottom: '10px', marginLeft: '10px' }}>
      <Col xs={12} md={12} lg={12}>
        <FormGroup style={{ marginBottom: '0' }}>
          <ControlLabel>Start Date</ControlLabel>
          <DatePicker
            id="datePicker"
            dateFormat="YYYY-MM-DD"
            selected={moment(startDate, 'YYYY-MM-DD')}
            includeDates={calendarDates}
            onChange={e => props.handleChange(moment(e).format('YYYY-MM-DD'))}
          />
        </FormGroup>
      </Col>
    </Row>
  );
};

export default StartDateSelector;
