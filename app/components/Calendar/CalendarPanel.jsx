import React from "react";
import moment from "moment";
import { Panel, Badge } from "react-bootstrap";
import sortBy from "lodash/sortBy";

class CalendarPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: moment().year().toString() === props.year ? true : false
    };
  }

  render() {
    const { name, year, terms } = this.props;
    var generateDates = terms => {
      var terms = sortBy(terms, o => {
        return o;
      });
      var dates = "";
      terms.map(date => {
        dates = dates + moment(date).format("DD MMM") + ", ";
      });
      return dates;
    };
    return (
      <div key={name+year}>
        <div style={{ border: "1px solid #9a9a9a", padding: "10px" }}>
          <Badge
            onClick={() => {
              this.setState({
                open: this.state.open ? false : true
              });
            }}
          >
            {year}
          </Badge>
        </div>
        <Panel collapsible expanded={this.state.open} style={{marginBottom: "0px"}}>
          {Object.keys(terms).map(termId => {
            return (
              <div
                key={name + year + termId}
                style={{
                  border: "1px solid #9a9a9a",
                  padding: "10px"
                }}
              >
                <b>
                  Term {termId}
                  <font style={{ color: "orange" }}>
                    ({_.size(terms[termId])} sessions)
                  </font>
                </b>
                <br />
                {generateDates(terms[termId])}
              </div>
            );
          })}
        </Panel>
      </div>
    );
  }
}

export default CalendarPanel;
