import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updateNavTitle } from 'actions';
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
      updateNavTitle(
        '/m/attendance/summary',
        selection.name + ' Attendance Summary'
      )
    );
  }

  render() {
    const { classes, terms } = this.props;

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
                    <option key={id} value={id}>
                      Term {id}
                    </option>
                  );
                })}
              </FormControl>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12} style={{ padding: '0px' }}>
            {Object.keys(classes).map(classKey => {
              return (
                <AttendanceTable
                  key={classKey}
                  classes={classes[classKey]}
                  selectedTerm={this.state.selectedTerm}
                />
              );
            })}
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    terms: getAllTermId(state.calendars, state.selection.key),
    selection: state.selection,
    calendars: state.calendars,
    classes: state.selection.classes
  };
}

export default connect(mapStateToProps)(AttendanceSummary);
