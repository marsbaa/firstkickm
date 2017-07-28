import React from 'react';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import { updateSelectedCentre, updateNavTitle } from 'actions';
import { isManager, isSuperAdmin } from 'helper';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

class MainMenu extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateNavTitle('/m', 'Dashboard'));
  }

  handleSelect(e) {
    const { dispatch, centres } = this.props;
    e.preventDefault();
    dispatch(updateSelectedCentre(centres[e.target.value]));
  }

  render() {
    const { selection, centres, user, auth } = this.props;
    var menuHTML = [];
    if (user.assignedRoles === 'Administrator') {
      menuHTML.push(
        <div key="adminmenu">
          <Link to="m/trials">
            <button
              className="mainbtn"
              id="trials"
              disabled={selection.id === '0' ? true : false}
            >
              Trials
            </button>
          </Link>
          <Link to="m/attendance">
            <button
              className="mainbtn"
              id="attendance"
              disabled={selection.id === '0' ? true : false}
            >
              Student Attendance
            </button>
          </Link>
          <Link to="m/payment">
            <button
              className="mainbtn"
              id="makePayment"
              disabled={selection.id === '0' ? true : false}
            >
              Payment
            </button>
          </Link>
          <Link to="m/jersey">
            <button
              className="mainbtn"
              id="jersey"
              disabled={selection.id === '0' ? true : false}
            >
              Jersey Issue
            </button>
          </Link>
          <Link to="m/total">
            <button
              className="mainbtn"
              id="totalCollection"
              disabled={selection.id === '0' ? true : false}
            >
              Total Collection (Today)
            </button>
          </Link>
          <Link to="m/coachattendance">
            <button
              className="mainbtn"
              id="coach"
              disabled={selection.id === '0' ? true : false}
            >
              Coach Attendance
            </button>
          </Link>
          <Link to="m/notes">
            <button
              className="mainbtn"
              id="notes"
              disabled={selection.id === '0' ? true : false}
            >
              Notes to HQ
            </button>
          </Link>
          <Link to="m/students">
            <button
              className="mainbtn"
              id="student"
              disabled={selection.id === '0' ? true : false}
            >
              Students Profile
            </button>
          </Link>
          <Link to="m/makeup">
            <button
              className="mainbtn"
              id="makeUp"
              disabled={selection.id === '0' ? true : false}
            >
              Make Up List
            </button>
          </Link>
        </div>
      );
    } else if (user.assignedRoles === 'Head Coach') {
      menuHTML.push(
        <div key="headcoachmenu">
          <Link to="m/coachattendance">
            <button
              className="mainbtn"
              id="coach"
              disabled={selection.id === '0' ? true : false}
            >
              Coach Attendance
            </button>
          </Link>
          <Link to="m/coachschedule">
            <button
              className="mainbtn"
              id="coachSchedule"
              disabled={selection.id === '0' ? true : false}
            >
              Coach Scheduling
            </button>
          </Link>
        </div>
      );
    } else if (user.assignedRoles === 'Manager') {
      menuHTML.push(
        <div key="managermenu">
          {isSuperAdmin(auth.email)
            ? <Link to="m/dashboard">
                <button className="mainbtn" id="dashboard">
                  Dashboard
                </button>
              </Link>
            : null}
          {isSuperAdmin(auth.email)
            ? <Link to="m/totalhq">
                <button
                  className="mainbtn"
                  id="totalCollectionHQ"
                  disabled={selection.id === '0' ? true : false}
                >
                  Total Collection (HQ)
                </button>
              </Link>
            : null}
          {isSuperAdmin(auth.email)
            ? <Link to="m/bankin">
                <button className="mainbtn" id="bankInCollection">
                  Bank In Collection
                </button>
              </Link>
            : null}
          <Link to="m/trials">
            <button
              className="mainbtn"
              id="trials"
              disabled={selection.id === '0' ? true : false}
            >
              Trials
            </button>
          </Link>
          <Link to="m/jersey">
            <button
              className="mainbtn"
              id="jersey"
              disabled={selection.id === '0' ? true : false}
            >
              Jersey Issue
            </button>
          </Link>
          <Link to="m/attendance">
            <button
              className="mainbtn"
              id="attendance"
              disabled={selection.id === '0' ? true : false}
            >
              Student Attendance
            </button>
          </Link>
          <Link to="m/attendance/summary">
            <button
              className="mainbtn"
              id="attendanceSummary"
              disabled={selection.id === '0' ? true : false}
            >
              Attendance Summary
            </button>
          </Link>
          <Link to="m/payment">
            <button
              className="mainbtn"
              id="makePayment"
              disabled={selection.id === '0' ? true : false}
            >
              Payment
            </button>
          </Link>
          <Link to="m/makeup">
            <button
              className="mainbtn"
              id="makeUp"
              disabled={selection.id === '0' ? true : false}
            >
              Make Up List
            </button>
          </Link>
          <Link to="m/payment/notpaid">
            <button
              className="mainbtn"
              id="paymentnotpaid"
              disabled={selection.id === '0' ? true : false}
            >
              Not Paid List
            </button>
          </Link>
          <Link to="m/payment/report">
            <button
              className="mainbtn"
              id="paymentReport"
              disabled={selection.id === '0' ? true : false}
            >
              Payment Report (HQ)
            </button>
          </Link>
          <Link to="m/total">
            <button
              className="mainbtn"
              id="totalCollection"
              disabled={selection.id === '0' ? true : false}
            >
              Total Collection (Today)
            </button>
          </Link>
          <Link to="m/coachattendance">
            <button
              className="mainbtn"
              id="coach"
              disabled={selection.id === '0' ? true : false}
            >
              Coach Attendance
            </button>
          </Link>
          <Link to="m/coachattendancehq">
            <button
              className="mainbtn"
              id="coach"
              disabled={selection.id === '0' ? true : false}
            >
              Coach Attendance (HQ)
            </button>
          </Link>
          <Link to="m/coachschedule">
            <button
              className="mainbtn"
              id="coachSchedule"
              disabled={selection.id === '0' ? true : false}
            >
              Coach Scheduling
            </button>
          </Link>
          <Link to="m/notes">
            <button
              className="mainbtn"
              id="notes"
              disabled={selection.id === '0' ? true : false}
            >
              Notes to HQ
            </button>
          </Link>
          <Link to="m/notes/all">
            <button className="mainbtn" id="notesall">
              Notes Inbox
            </button>
          </Link>
          <Link to="m/charts">
            <button
              className="mainbtn"
              id="charts"
              disabled={selection.id === '0' ? true : false}
            >
              Charts
            </button>
          </Link>
          <Link to="m/students">
            <button
              className="mainbtn"
              id="student"
              disabled={selection.id === '0' ? true : false}
            >
              Students Profile
            </button>
          </Link>
          <Link to="m/coaches">
            <button className="mainbtn">Coaches Profile</button>
          </Link>
        </div>
      );
    }

    return (
      <Grid style={{ marginTop: '10px' }}>
        <Row>
          <Col xs={12} md={12}>
            <FormGroup
              style={{ textAlign: 'center', margin: '3px 5px', width: '100%' }}
            >
              <ControlLabel>Select Centre</ControlLabel>
              <FormControl
                id="centreSelect"
                componentClass="select"
                placeholder="select"
                onChange={this.handleSelect.bind(this)}
                defaultValue={selection.key}
              >
                {isEmpty(centres)
                  ? null
                  : user.assignedCentres.map(centreKey => {
                      return (
                        <option key={centreKey} value={centreKey}>
                          {centres[centreKey].name}
                        </option>
                      );
                    })}
              </FormControl>
            </FormGroup>
            {menuHTML}
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    selection: state.selection,
    centres: state.centres,
    user: find(state.users, { email: state.auth.email }),
    auth: state.auth
  };
}

export default connect(mapStateToProps)(MainMenu);
