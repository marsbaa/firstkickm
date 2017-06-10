import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
var actions = require('actions');
import _ from 'lodash';
import moment from 'moment';
import AttendanceTable from 'AttendanceTable';
import { getTerm, getAllTermId } from 'helper';

class AttendanceSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: 3
    };
  }
  handleSelect(e) {
    this.setState({ selectedTerm: e.target.value });
  }

  componentDidMount() {
    const { dispatch, selection, calendars } = this.props;
    let id = getTerm(calendars, selection.key, moment());
    document.getElementById('termSelect').value = id;
    this.setState({ selectedTerm: id });
    dispatch(
      actions.updateNavTitle(
        '/m/attendance/summary',
        selection.name + ' Attendance Summary'
      )
    );
  }

  render() {
    const { selection, calendars } = this.props;
    const classes = selection.classes;
    let html = [];
    Object.keys(classes).forEach(classKey => {
      html.push(
        <AttendanceTable
          key={classKey}
          classes={classes[classKey]}
          selectedTerm={this.state.selectedTerm}
        />
      );
    });

    const terms = getAllTermId(calendars, selection.key);

    return (
      <Grid style={{ marginTop: '20px' }}>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <FormGroup>
              <FormControl
                id="termSelect"
                componentClass="select"
                placeholder="select"
                onChange={this.handleSelect.bind(this)}
              >
                <option value="select">select</option>
                {terms.map(id => {
                  return (
                    <option key={selection.key + id} value={id}>
                      Term {id}
                    </option>
                  );
                })}
              </FormControl>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {html}
          </Col>
        </Row>

      </Grid>
    );
  }
}

export default connect(state => {
  return state;
})(AttendanceSummary);
