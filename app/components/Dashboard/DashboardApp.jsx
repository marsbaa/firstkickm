import React from 'react';
import { Row, Col, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updateNavTitle, startAddTrials } from 'actions';
import { getTermId, getAllTermId } from 'helper';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import ChartPaymentReport from 'ChartPaymentReport';
import ChartTrialConversion from 'ChartTrialConversion';
import Loading from 'Loading';

class DashboardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: '3',
      selectedYear: moment().year()
    };
  }

  componentWillMount() {
    const { dispatch, trials } = this.props;
    if (isEmpty(trials)) {
      dispatch(startAddTrials());
    }
  }

  componentDidMount() {
    const { dispatch, calendars } = this.props;
    const id = getTermId(calendars);
    document.getElementById('termSelect').value = id;
    this.setState({ selectedTerm: id });
    dispatch(updateNavTitle('/m/dashboard', 'Dashboard'));
  }

  handleSelect(e) {
    this.setState({ selectedTerm: e.target.value });
  }

  handleSelectYear(e) {
    e.preventDefault();
    console.log(e.target.value)
    this.setState({ selectedYear: e.target.value });
  }

  render() {
    const { calendars, students, centres, trials, classes, makeUps} = this.props;

    //Generate Year Options
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
      <div>
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
        <ChartPaymentReport
          selectedTerm={this.state.selectedTerm}
          selectedYear={this.state.selectedYear}
          students={students}
          calendars={calendars}
          centres={centres}
          classes={classes}
          makeUps={makeUps}
        />
        <ChartTrialConversion
          selectedTerm={this.state.selectedTerm}
          selectedYear={this.state.selectedYear}
          calendars={calendars}
          centres={centres}
          trials={trials}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    classes: state.classes,
    calendars: state.calendars,
    students: filter(state.students, o => {
      return !(o.status === 'Not Active');
    }),
    centres: state.centres,
    trials: filter(state.trials, o => {
      return moment(o.dateAdded).isAfter('2017-03-01', 'day');
    }),
    makeUps: state.makeUps
  };
}

export default connect(mapStateToProps)(DashboardApp);
