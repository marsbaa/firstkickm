import React from "react";
import { connect } from "react-redux";
import { startExpenses } from "actions";
import { Row, Col, FormControl, FormGroup } from "react-bootstrap";
import IncomeList from "IncomeList";
import ExpenseList from "ExpenseList";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";

class ExpenseApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment().month(),
      centre: ""
    };
    this.handleSelectYear = this.handleSelectYear.bind(this);
    this.handleSelectMonth = this.handleSelectMonth.bind(this);
    this.handleSelectCentre = this.handleSelectCentre.bind(this);
  }
  componentWillMount() {
    let { dispatch } = this.props;
    if (isEmpty(expenses)) {
      dispatch(startExpenses());
    }
  }

  handleSelectYear(e) {
    e.preventDefault();
    this.setState({ year: e.target.value });
  }

  handleSelectMonth(e) {
    e.preventDefault();
    this.setState({ month: e.target.value });
  }

  handleSelectCentre(e) {
    e.preventDefault();
    this.setState({ centre: e.target.value });
  }
  render() {
    const { expenses, centres, classes, calendars } = this.props;
    let filteredExpenses = filter(expenses, o => {
      return (
        moment(o.date).month() === parseInt(this.state.month) &&
        moment(o.date).year() === parseInt(this.state.year)
      );
    });

    //Generate Centre Options
    let centreOptions = [];
    centreOptions.push(
      <option key={"Select"} value={"Select"}>
        Select
      </option>
    );
    Object.keys(centres).map(centreKey => {
      centreOptions.push(
        <option key={centreKey} value={centreKey}>
          {centres[centreKey].name}
        </option>
      );
    });
    //Generate Month Options
    let monthOptions = [];
    monthOptions.push(
      <option key={"Select"} value={"Select"}>
        Select
      </option>
    );
    for (let i = 0; i < 12; i++) {
      if (moment(new Date(this.state.year, i, 0)).isSameOrBefore()) {
        monthOptions.push(
          <option key={i} value={i}>
            {moment()
              .month(i)
              .format("MMM")}
          </option>
        );
      }
    }

    //Generate Year Options
    var yearOptions = [];
    yearOptions.push(
      <option key={"Select"} value={"Select"}>
        Select
      </option>
    );
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

    //Centre
    let name = this.state.centre === "" ? "" : centres[this.state.centre].name;

    //Classes by Centre
    let filteredClasses = filter(classes, { centreKey: this.state.centre });

    //Calendars by Centre
    let filteredCalendars = filter(calendars, { centreKey: this.state.centre });

    return (
      <div>
        <Row
          style={{
            backgroundColor: "#ffc600",
            color: "#656565",
            padding: "10px 15px"
          }}
        >
          <Col xs={4} md={4}>
            <FormGroup>
              <FormControl
                style={{ padding: "6px 6px 5px 2px" }}
                id="yearSelect"
                componentClass="select"
                placeholder="select"
                defaultValue={this.state.centre}
                onChange={this.handleSelectCentre}
              >
                {centreOptions}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={3} md={3}>
            <FormGroup>
              <FormControl
                style={{ padding: "6px 6px 5px 2px" }}
                id="yearSelect"
                componentClass="select"
                placeholder="select"
                defaultValue={this.state.year}
                onChange={this.handleSelectYear}
              >
                {yearOptions}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={3} md={3} style={{ paddingLeft: "0px" }}>
            <FormGroup>
              <FormControl
                style={{ padding: "6px 6px 5px 2px", width: "75%" }}
                id="monthSelect"
                componentClass="select"
                placeholder="select"
                defaultValue={this.state.month}
                onChange={this.handleSelectMonth}
              >
                {monthOptions}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={6} md={6} />
        </Row>
        {name !== "" ? (
          <div key={this.state.centre + "header"}>
            <Row
              style={{
                backgroundColor: "#656565",
                padding: "0px 15px",
                color: "#ffc600"
              }}
            >
              <Col xs={12} md={12}>
                <h5>
                  {name} {moment(this.state.month + 1, "M").format("MMM")} ({
                    this.state.year
                  })
                </h5>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12}>
                <ExpenseList
                  classes={filteredClasses}
                  calandars={filteredCalendars}
                  year={this.state.year}
                  month={this.state.month}
                />
              </Col>
            </Row>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    expenses: state.expenses,
    centres: state.centres,
    classes: state.classes,
    calendars: state.calendars
  };
}

export default connect(mapStateToProps)(ExpenseApp);
