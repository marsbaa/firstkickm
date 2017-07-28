import React from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Row,
  Col
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { getCentreKey } from 'helper';

class CentreSelector extends React.Component {
  render() {
    const { centres, venueId } = this.props;

    return (
      <FormGroup>
        <ControlLabel>Selected Centre</ControlLabel>
        <FormControl
          componentClass="select"
          defaultValue={getCentreKey(centres, venueId)}
          onChange={e => {
            this.props.handleChange(centres[e.target.value].id);
          }}
        >
          <option key="0" value="0">
            select
          </option>
          {Object.keys(centres).map(centreKey => {
            const { name } = centres[centreKey];
            return (
              <option key={centreKey} value={centreKey}>
                {_.upperFirst(name)}
              </option>
            );
          })}
        </FormControl>
      </FormGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    centres: state.centres
  };
}

export default connect(mapStateToProps)(CentreSelector);
