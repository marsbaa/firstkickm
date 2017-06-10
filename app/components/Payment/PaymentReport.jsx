import React from 'react';
import { Link } from 'react-router';
import {
  Row,
  Col,
  FormGroup,
  FormControl,
  Badge,
  ProgressBar,
  Label
} from 'react-bootstrap';
import { connect } from 'react-redux';
import PayerReport from 'PayerReport';
var actions = require('actions');
import StudentsFilter from 'StudentsFilter';
import _ from 'lodash';
import moment from 'moment';
import { getTerm, getAllTermId, findPaymentDetails } from 'helper';

class PaymentReport extends React.Component {
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
    e.preventDefault();
    this.setState({ year: e.target.value });
  }

  componentDidMount() {
    var { dispatch, selection, calendars } = this.props;
    var id = getTerm(calendars, selection.key, moment());
    document.getElementById('termSelect').value = id;
    this.setState({ selectedTerm: id });
    dispatch(
      actions.updateNavTitle(
        '/m/payment/report',
        selection.name + ' Payment Report'
      )
    );
  }

  render() {
    var { students, searchText, selection, calendars } = this.props;

    var html = [];
    var studentsPaid = 0;
    var studentsUnPaid = 0;
    var totalPaid = 0;
    var calendar;
    var classes = selection.classes;

    Object.keys(classes).forEach(classKey => {
      var { day, startTime, endTime, ageGroup, calendarKey } = classes[
        classKey
      ];

      var classTime = startTime + ' - ' + endTime;

      //Create TermDates Array
      calendar = _.find(calendars, { key: calendarKey });
      var termDates = [];
      calendar.terms[this.state.selectedTerm].map(date => {
        termDates.push(date);
      });

      //Filter Students base on Class

      var filteredStudents = _.filter(students, {
        venueId: selection.id,
        currentClassDay: _.capitalize(day),
        currentClassTime: classTime,
        ageGroup: ageGroup
      });
      filteredStudents = _.filter(filteredStudents, o => {
        return !(o.status === 'Not Active');
      });

      const { paid, paidAmount, paidDetails, unpaid } = findPaymentDetails(
        filteredStudents,
        termDates,
        this.state.selectedTerm
      );

      //Display Class Time Day Header
      if (_.size(paid) !== 0 || _.size(unpaid) !== 0) {
        html.push(
          <Row
            key={ageGroup + classTime + day}
            style={{
              backgroundColor: '#656565',
              padding: '0px 15px',
              color: '#ffc600'
            }}
          >
            <Col xs={12} md={12}>
              <h5>{ageGroup} {classTime} ({_.capitalize(day)})</h5>
            </Col>
          </Row>
        );
      }

      studentsPaid += _.size(paid);
      totalPaid += paidAmount;
      studentsUnPaid += _.size(unpaid);

      //Progress Bar Value
      const now = Math.round(
        _.size(paid) / (_.size(paid) + _.size(unpaid)) * 100
      );

      //Display Paid List
      if (_.size(paid) !== 0) {
        html.push(
          <Row
            key={'paidlist' + ageGroup + classTime + day}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px 15px',
              borderBottom: '1px solid #cccccc',
              fontSize: '12px',
              fontWeight: '800'
            }}
          >
            <Col xs={6} md={6}>
              Paid
              {' '}
              <Badge>{_.size(paid)}</Badge>
              {' '}
              Amount
              {' '}
              <Badge>${paidAmount}</Badge>
            </Col>
            <Col xs={6} md={6}>
              <ProgressBar
                striped
                active
                bsStyle="success"
                now={now}
                label={`${now}%`}
                style={{ marginBottom: '0' }}
              />
            </Col>
          </Row>
        );

        Object.keys(paid).map(paidId => {
          html.push(
            <PayerReport
              key={paid[paidId].key}
              student={paid[paidId]}
              paymentDetails={paidDetails[paidId]}
              selectedTerm={this.state.selectedTerm}
            />
          );
        });
      }

      //Display UnPaid List
      if (_.size(unpaid) !== 0) {
        html.push(
          <Row
            key={'unpaidlist' + ageGroup + classTime + day}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px 15px',
              borderBottom: '1px solid #cccccc',
              fontSize: '12px',
              fontWeight: '800'
            }}
          >
            <Col xs={12} md={12}>
              Unpaid <Badge>{_.size(unpaid)}</Badge>
            </Col>
          </Row>
        );

        Object.keys(unpaid).forEach(unpaidId => {
          html.push(
            <PayerReport
              key={unpaid[unpaidId].key}
              student={unpaid[unpaidId]}
              paymentDetails="none"
              selectedTerm={this.state.selectedTerm}
            />
          );
        });
      }
    });

    //Display Number of Students Paid
    html.push(
      <Row
        key={'studentsPaid'}
        style={{
          padding: '8px 20px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Col
          xs={12}
          md={12}
          lg={12}
          style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '16px' }}
        >
          <h4>
            Students (Paid)
            <Label>{studentsPaid}</Label>
          </h4>
        </Col>
      </Row>
    );

    //Display Total Amount Paid
    html.push(
      <Row
        key={'amountPaid'}
        style={{
          padding: '8px 20px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Col
          xs={12}
          md={12}
          lg={12}
          style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '16px' }}
        >
          <h4>
            Total (Paid)
            <Label>${totalPaid}</Label>
          </h4>
        </Col>
      </Row>
    );

    //Display Number of Student Not Paid
    html.push(
      <Row
        key={'studentsUnPaid'}
        style={{
          padding: '8px 20px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Col
          xs={12}
          md={12}
          lg={12}
          style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '16px' }}
        >
          <h4>Students (Unpaid) <Label>{studentsUnPaid}</Label></h4>
        </Col>
      </Row>
    );

    //Display Potential Collection
    html.push(
      <Row
        key={'amountUnPaid'}
        style={{
          padding: '8px 20px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Col
          xs={12}
          md={12}
          lg={12}
          style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '16px' }}
        >
          <h4>
            Potential Total (Unpaid)
            <Label>${studentsUnPaid * 280}</Label>
          </h4>
        </Col>
      </Row>
    );

    //Display Progress Bar for Paid vs UnPaid
    const nowPaid = Math.round(
      studentsPaid / (studentsPaid + studentsUnPaid) * 100
    );
    const nowUnPaid = Math.round(
      studentsUnPaid / (studentsPaid + studentsUnPaid) * 100
    );
    html.push(
      <Row
        key={'progressBar'}
        style={{
          padding: '8px 20px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Col
          xs={12}
          md={12}
          lg={12}
          style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '16px' }}
        >
          <ProgressBar style={{ marginBottom: '0' }}>
            <ProgressBar
              striped
              active
              bsStyle="success"
              now={nowPaid}
              label={`${nowPaid}%`}
              style={{ marginBottom: '0' }}
              key={1}
            />
            <ProgressBar
              striped
              active
              bsStyle="danger"
              now={nowUnPaid}
              label={`${nowUnPaid}%`}
              style={{ marginBottom: '0' }}
              key={2}
            />
          </ProgressBar>
        </Col>
      </Row>
    );

    //Generate Term Options
    var terms = getAllTermId(calendars, selection.key);

    //Generate Year Options
    var yearOptions = [];
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
            backgroundColor: '#ffc600',
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
                    <option key={selection.key + id} value={id}>
                      Term {id}
                    </option>
                  );
                })}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={5} md={5} lg={5}>
            <button className="btn" style={{ float: 'right', height: '34px' }}>
              Send Reminder
            </button>
          </Col>
        </Row>
        {html}
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(PaymentReport);
