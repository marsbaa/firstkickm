import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';

const DateSelector = ({ termDates, selectedDate, handleChange }) => {
  return (
    <Row
      style={{
        padding: '8px 10px',
        borderBottom: '1px solid #cccccc',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Col xs={12} md={12}>
        <FormGroup style={{ marginBottom: '0' }}>
          <ControlLabel>Date of Session</ControlLabel>
          <DatePicker
            id="datePicker"
            dateFormat="YYYY-MM-DD"
            selected={selectedDate}
            includeDates={termDates}
            onChange={e => handleChange(e)}
          />
        </FormGroup>
      </Col>
    </Row>
  );
};

export default DateSelector;
