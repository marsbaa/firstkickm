import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updateNavTitle } from 'actions';
import moment from 'moment';
import AttendanceTable from 'AttendanceTable';
import { getTerm, getAllTermId } from 'helper';
import filter from 'lodash/filter'

class AttendanceSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: 3,
      selectedYear: moment().year()
    };
  }
  handleSelect(e) {
    this.setState({ selectedTerm: e.target.value });
  }

  handleSelectYear(e) {
    this.setState({ selectedYear: e.target.value });
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
    const { classes } = this.props;
    let terms = ['1', '2', '3', '4', '5', '6'];
    let yearOptions = [];
    yearOptions.push(
      <option key={moment().year()} value={moment().year()}>
        {moment().year()}
      </option>
    );
    yearOptions.push(
      <option key={moment().year() - 1} value={moment().year() - 1}>
        {moment().year() - 1}
      </option>
    );

    return (
      <Grid style={{ marginTop: '20px' }}>
      <Row
          style={{
            borderBottom: '1px solid #e2e2e2',
            color: '#656565',
            padding: '15px 15px 5px 15px'
          }}
        >
          <Col xs={3} md={3}>
            <FormGroup>
              <FormControl
                style={{ padding: '6px 6px 5px 2px' }}
                id="yearSelect"
                componentClass="select"
                placeholder="select"
                defaultValue={this.state.selectedYear}
                onChange={this.handleSelectYear.bind(this)}
              >
                {yearOptions}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={4} md={4} lg={4} style={{ paddingLeft: '0px' }}>
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
                  cla={classes[classKey]}
                  selectedTerm={this.state.selectedTerm}
                  selectedYear={this.state.selectedYear}
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
    selection: state.selection,
    calendars: state.calendars,
    classes: filter(state.classes, {centreKey: state.selection.key})
  };
}

export default connect(mapStateToProps)(AttendanceSummary);
