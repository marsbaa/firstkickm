import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Row,
  Col
} from 'react-bootstrap';

const TimeDaySelector = props => {
  const { classTimeDays, timeDay } = props;
  return (
    <FormGroup>
      <ControlLabel>Selected Class Time</ControlLabel>
      <FormControl
        componentClass="select"
        defaultValue={timeDay}
        onChange={e => {
          const s = e.target.value.split(',');
          props.handleChange(s[0], s[1]);
        }}
      >
        <option key="0" value="0">
          select
        </option>
        {Object.keys(classTimeDays).map(classId => {
          const { key, value } = classTimeDays[classId];
          return (
            <option key={key} value={value}>
              {key}
            </option>
          );
        })}
      </FormControl>
    </FormGroup>
  );
};

export default TimeDaySelector;
