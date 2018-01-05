import React from "react";
import { Link } from "react-router";
import { Glyphicon, Badge, Panel } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";
import CalendarPanel from "CalendarPanel";
import TermDatesSelector from "TermDatesSelector";
import filter from "lodash/filter";

class CalendarList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  openModal(e, id) {
    e.preventDefault();
    this.props.openModal();
    this.props.handleDeleteKey(id);
    this.props.handleDeleteType("calendar");
  }

  render() {
    var { centreKey, calendars } = this.props;

    return (
      <div>
        {Object.keys(calendars).map(id => {
          var calendar = calendars[id];
          return (
            <div key={calendar.name}>
              <div
                style={{
                  backgroundColor: "#9a9a9a",
                  padding: "10px",
                  color: "white",
                  borderRadius: "5px 5px 0px 0px",
                  marginTop: "5px"
                }}
              >
                {calendar.name}
                <button
                  className="innerbtn"
                  style={{ float: "right" }}
                  onClick={e => this.openModal(e, calendar.key)}
                >
                  <Glyphicon glyph="trash" />
                </button>
                <Link
                  to={"/m/centres/" + centreKey + "/" + calendar.key}
                  activeClassName="active"
                >
                  <button className="innerbtn" style={{ float: "right" }}>
                    <Glyphicon glyph="pencil" />
                  </button>
                </Link>
              </div>
              {Object.keys(calendar.terms).map(year => {
                return (
                  <CalendarPanel
                    key={calendar.name + year}
                    year={year}
                    name={calendar.name}
                    terms={calendar.terms[year]}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    calendars: filter(state.calendars, { centreKey: props.centreKey })
  };
}

export default connect(mapStateToProps)(CalendarList);
