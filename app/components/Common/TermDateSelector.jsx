import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Row,
  Col
} from 'react-bootstrap';
import moment from 'moment';

const TermDateSelector = props => {
  const { calendarDates, dateOfTrial } = props;

  return (
    <FormGroup>
      <ControlLabel>Date Of Trial</ControlLabel>
      <FormControl
        componentClass="select"
        defaultValue={dateOfTrial}
        onChange={e => {
          props.handleChange(e.target.value);
        }}
      >
        <option key="0" value="0">
          select
        </option>
        {calendarDates.map(date => {
          const formattedDate = moment(date).format('YYYY-MM-DD');
          const day = moment(date).format('dddd');
          return (
            <option key={formattedDate} value={formattedDate}>
              {formattedDate} ({day})
            </option>
          );
        })}
      </FormControl>
    </FormGroup>
  );
};

export default TermDateSelector;
