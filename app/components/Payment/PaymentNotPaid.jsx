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
import PaymentClassList from 'PaymentClassList';
import SMSModal from 'SMSModal';
import {updateNavTitle} from 'actions'
import StudentsFilter from 'StudentsFilter';
import find from 'lodash/find'
import capitalize from 'lodash/capitalize'
import size from 'lodash/size'
import filter from 'lodash/filter'
import moment from 'moment';
import { getTerm, findPaymentDetails, getAllTermId } from 'helper';

class PaymentNotPaid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: 3,
      selectedYear: moment().year(),
      show: false
    };
  }

  handleSelect(e) {
    this.setState({ selectedTerm: e.target.value });
  }

  handleSelectYear(e) {
    e.preventDefault();
    this.setState({ selectedYear: e.target.value });
  }

  open() {
    this.setState({ show: true });
  }

  close() {
    this.setState({ show: false });
  }

  componentDidMount() {
    var { dispatch, selection, calendars } = this.props;
    var id = getTerm(calendars, selection.key, moment());
    document.getElementById('termSelect').value = id;
    this.setState({ selectedTerm: id });
    dispatch(
      updateNavTitle(
        '/m/payment/notpaid',
        selection.name + ' Not Paid List'
      )
    );
  }

  render() {
    const { selection, calendars, students, classes, makeUps } = this.props;

    var html = [];
    var calendar;
    var contacts = '';
    Object.keys(classes).forEach(classKey => {
      var { day, startTime, endTime, ageGroup, calendarKey } = classes[
        classKey
      ];

      var classTime = startTime + ' - ' + endTime;

      //Create TermDates Array
      calendar = find(calendars, { key: calendarKey });
      var termDates = [];
      if (calendar.terms !== undefined) {
        if (calendar.terms[this.state.selectedYear] !== undefined) {
          if (calendar.terms[this.state.selectedYear][this.state.selectedTerm] !== undefined) {
            calendar.terms[this.state.selectedYear][this.state.selectedTerm].map(date => {
              termDates.push(date);
            });
          }
        }
      }
     

      //Filter Students base on Class

      var filteredStudents = filter(students, {
        venueId: selection.id,
        currentClassDay: capitalize(day),
        currentClassTime: classTime,
        ageGroup: ageGroup
      });
      filteredStudents = filter(filteredStudents, o => {
        return !(o.status === 'Not Active');
      });

      const { paid, paidAmount, paidDetails, unpaid } = findPaymentDetails(
        filteredStudents,
        termDates,
        this.state.selectedTerm,
        this.state.selectedYear,
        makeUps
      );
      if (size(unpaid) !== 0) {
        html.push(
          <PaymentClassList
            key={classKey}
            group={unpaid}
            title={ageGroup + ' ' + classTime + ' (' + capitalize(day) + ')'}
          />
        );
      }
    });

    var terms = getAllTermId(calendars, selection.key);

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

    let close = () => this.setState({ show: false });
    var message = `<FKA> - Dear Parents,
Please be reminded to make term 3 payment this weekend if you have not made any payment.
If you would like to pay by Internet banking transfer, please screen shot your payment proof and send to our number through sms or whatsapp at +6591010666.  Our bank account is OCBC bank account no 526-286570-001
Thank you
FKA-Admin`;

    return (
      <div>
        <SMSModal
          showModal={this.state.show}
          closeModal={this.close.bind(this)}
          title="SMS Payment Reminder"
          message={encodeURIComponent(message)}
          contacts={contacts}
        />
        <Row
          style={{
            backgroundColor: '#ffc600',
            color: '#656565',
            padding: '15px 15px 5px 15px'
          }}
        >
          <Col xs={3} md={3} lg={3} style={{ paddingRight: '2px' }}>
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
          <Col
            xs={3}
            md={3}
            lg={3}
            style={{ paddingLeft: '0px', paddingRight: '2px' }}
          >
            <FormGroup>
              <FormControl
                id="termSelect"
                componentClass="select"
                placeholder="select"
                onChange={this.handleSelect.bind(this)}
                style={{ padding: '6px 2px 5px 2px' }}
              >
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
          <Col xs={6} md={6} lg={6} style={{ paddingLeft: '0px' }}>
            <button
              className="btn"
              style={{ float: 'right', height: '34px', marginRight: '2px' }}
              onClick={() => this.setState({ show: true })}
            >
              Send Reminder
            </button>

          </Col>
        </Row>
        {html}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selection: state.selection, 
    calendars: state.calendars, 
    students: state.students, 
    classes: filter(state.classes, {centreKey: state.selection.key}),
    makeUps: state.makeUps
  }
}

export default connect(mapStateToProps)(PaymentNotPaid);
