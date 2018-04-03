import React from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { connect } from "react-redux";
import { Link, IndexLink } from "react-router";
import { updateSelectedCentre, updateNavTitle } from "actions";
import { isManager, isSuperAdmin } from "helper";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";

class MainMenu extends React.Component {
  componentDidMount() {
    const { dispatch, user, centres } = this.props;
    dispatch(updateNavTitle("/m", "Dashboard"));
  }

  handleSelect(e) {
    const { dispatch, centres } = this.props;
    dispatch(updateSelectedCentre(centres[e.target.value]));
  }

  render() {
    const { selection, centres, user, auth } = this.props;
    var menuHTML = [];
    if (user.assignedRoles === "Administrator") {
      menuHTML.push(
        <Row key="adminmenu">
          <Col xs={12} md={12} lg={12}>
            <Link to="m/trials">
              <button
                className="mainbtn"
                id="trials"
                disabled={selection.id === "0" ? true : false}
              >
                Trials
              </button>
            </Link>
            <Link to="m/attendance">
              <button
                className="mainbtn"
                id="attendance"
                disabled={selection.id === "0" ? true : false}
              >
                Student Attendance
              </button>
            </Link>
            <Link to="m/payment">
              <button
                className="mainbtn"
                id="makePayment"
                disabled={selection.id === "0" ? true : false}
              >
                Payment
              </button>
            </Link>
            <Link to="m/jersey">
              <button
                className="mainbtn"
                id="jersey"
                disabled={selection.id === "0" ? true : false}
              >
                Jersey Issue
              </button>
            </Link>
            <Link to="m/total">
              <button
                className="mainbtn"
                id="totalCollection"
                disabled={selection.id === "0" ? true : false}
              >
                Total Collection (Today)
              </button>
            </Link>
            <Link to="m/coachattendance">
              <button
                className="mainbtn"
                id="coach"
                disabled={selection.id === "0" ? true : false}
              >
                Coach Attendance
              </button>
            </Link>
            <Link to="m/notes">
              <button
                className="mainbtn"
                id="notes"
                disabled={selection.id === "0" ? true : false}
              >
                Notes to HQ
              </button>
            </Link>
            <Link to="m/students">
              <button
                className="mainbtn"
                id="student"
                disabled={selection.id === "0" ? true : false}
              >
                Students Profile
              </button>
            </Link>
            <Link to="m/makeup">
              <button
                className="mainbtn"
                id="makeUp"
                disabled={selection.id === "0" ? true : false}
              >
                Make Up List
              </button>
            </Link>
          </Col>
        </Row>
      );
    } else if (user.assignedRoles === "Head Coach") {
      menuHTML.push(
        <div key="headcoachmenu">
          <Link to="m/coachattendance">
            <button
              className="mainbtn"
              id="coach"
              disabled={selection.id === "0" ? true : false}
            >
              Coach Attendance
            </button>
          </Link>
          <Link to="m/coachschedule">
            <button
              className="mainbtn"
              id="coachSchedule"
              disabled={selection.id === "0" ? true : false}
            >
              Coach Scheduling
            </button>
          </Link>
        </div>
      );
    } else if (user.assignedRoles === "Manager") {
      menuHTML.push(
        <Row key="managermenu">
          <Col xs={12} md={12} lg={12}>
            {isSuperAdmin(auth.email) ? (
              <Link to="m/dashboard">
                <button className="mainbtn" id="dashboard">
                  Dashboard
                </button>
              </Link>
            ) : null}
            {isSuperAdmin(auth.email) ? (
              <Link to="m/totalhq">
                <button
                  className="mainbtn"
                  id="totalCollectionHQ"
                  disabled={selection.id === "0" ? true : false}
                >
                  Total Collection (HQ)
                </button>
              </Link>
            ) : null}
            {isSuperAdmin(auth.email) ? (
              <Link to="m/bankin">
                <button className="mainbtn" id="bankInCollection">
                  Bank In Collection
                </button>
              </Link>
            ) : null}
            {isSuperAdmin(auth.email) ? (
              <Link to="m/cancel">
                <button className="mainbtn" id="cancelSession">
                  Cancel Session
                </button>
              </Link>
            ) : null}
            <Link to="m/attendance/summary">
              <button
                className="mainbtn"
                id="attendanceSummary"
                disabled={selection.id === "0" ? true : false}
              >
                Attendance Summary
              </button>
            </Link>
            <Link to="m/payment/report">
              <button
                className="mainbtn"
                id="paymentReport"
                disabled={selection.id === "0" ? true : false}
              >
                Payment Report (HQ)
              </button>
            </Link>
            <Link to="m/trials">
              <button
                className="mainbtn"
                id="trials"
                disabled={selection.id === "0" ? true : false}
              >
                Trials
              </button>
            </Link>
            <Link to="m/attendance">
              <button
                className="mainbtn"
                id="attendance"
                disabled={selection.id === "0" ? true : false}
              >
                Student Attendance
              </button>
            </Link>

            <Link to="m/payment">
              <button
                className="mainbtn"
                id="makePayment"
                disabled={selection.id === "0" ? true : false}
              >
                Payment
              </button>
            </Link>
            <Link to="m/jersey">
              <button
                className="mainbtn"
                id="jersey"
                disabled={selection.id === "0" ? true : false}
              >
                Jersey Issue
              </button>
            </Link>
            <Link to="m/makeup">
              <button
                className="mainbtn"
                id="makeUp"
                disabled={selection.id === "0" ? true : false}
              >
                Make Up List
              </button>
            </Link>
            <Link to="m/payment/notpaid">
              <button
                className="mainbtn"
                id="paymentnotpaid"
                disabled={selection.id === "0" ? true : false}
              >
                Not Paid List
              </button>
            </Link>

            <Link to="m/total">
              <button
                className="mainbtn"
                id="totalCollection"
                disabled={selection.id === "0" ? true : false}
              >
                Total Collection (Today)
              </button>
            </Link>
            <Link to="m/coachattendance">
              <button
                className="mainbtn"
                id="coach"
                disabled={selection.id === "0" ? true : false}
              >
                Coach Attendance
              </button>
            </Link>
            <Link to="m/coachattendancehq">
              <button
                className="mainbtn"
                id="coach"
                disabled={selection.id === "0" ? true : false}
              >
                Coach Attendance (HQ)
              </button>
            </Link>
            <Link to="m/coachschedule">
              <button
                className="mainbtn"
                id="coachSchedule"
                disabled={selection.id === "0" ? true : false}
              >
                Coach Scheduling
              </button>
            </Link>
            <Link to="m/notes">
              <button
                className="mainbtn"
                id="notes"
                disabled={selection.id === "0" ? true : false}
              >
                Notes to HQ
              </button>
            </Link>
            <Link to="m/notes/all">
              <button className="mainbtn" id="notesall">
                Notes Inbox
              </button>
            </Link>
            <Link to="m/students">
              <button
                className="mainbtn"
                id="student"
                disabled={selection.id === "0" ? true : false}
              >
                Students Profile
              </button>
            </Link>
            <Link to="m/coaches">
              <button className="mainbtn">Coaches Profile</button>
            </Link>
            <Link to="m/credits">
              <button className="mainbtn">Credits</button>
            </Link>
            {isSuperAdmin(auth.email) ? (
              <Link to="m/expenses">
                <button className="mainbtn" id="expenses">
                  Expenses
                </button>
              </Link>
            ) : null}
            {isSuperAdmin(auth.email) ? (
              <Link to="m/studentstransfer">
                <button
                  className="mainbtn"
                  id="studentTransfer"
                  disabled={selection.id === "0" ? true : false}
                >
                  Student Transfer
                </button>
              </Link>
            ) : null}
          </Col>
        </Row>
      );
    }

    return (
      <Grid style={{ margin: "10px 15px" }}>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <FormGroup style={{ textAlign: "center" }}>
              <ControlLabel>Select Centre</ControlLabel>
              <FormControl
                id="centreSelect"
                componentClass="select"
                placeholder="select"
                onChange={this.handleSelect.bind(this)}
                defaultValue={selection.key}
              >
                <option key={0} value={0}>
                  Select Centre
                </option>
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
          </Col>
        </Row>
        {menuHTML}
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
