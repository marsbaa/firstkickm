import React from "react";
import { startCredits, updateCredit } from "actions";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import find from "lodash/find";
import { Row, Col } from "react-bootstrap";
import Search from "Search";
import Credit from "Credit";
import moment from "moment";

class MakeUpApp extends React.Component {
  componentDidMount() {
    var { dispatch, credits } = this.props;
    if (isEmpty(credits)) {
      dispatch(startCredits());
    }
  }

  updateCreditStatus(credit) {
    let { dispatch } = this.props;
    let inactiveCredit = {
      ...credit,
      inactive: credit.inactive ? false : true
    };
    dispatch(updateCredit(inactiveCredit));
  }

  render() {
    const { credits, students, searchText } = this.props;
    let filteredStudents = students.filter(student => {
      let text = student.childName.toLowerCase();
      return searchText.length === 0 || text.indexOf(searchText) !== -1;
    });
    return (
      <div>
        <Row
          style={{
            padding: "8px 10px",
            borderBottom: "1px solid #cccccc",
            display: "flex",
            alignItems: "center"
          }}
        >
          <Col xs={12} md={12}>
            <Search type="student" />
          </Col>
        </Row>
        {Object.keys(credits).map(key => {
          const { studentKey, date } = credits[key];
          const student = find(filteredStudents, { key: studentKey });
          if (student !== undefined) {
            return (
              <div key={key}>
                <Credit
                  childName={student.childName}
                  date={moment(date).format("DD/MM/YY")}
                  updateCreditStatus={this.updateCreditStatus.bind(this)}
                  credit={credits[key]}
                />
              </div>
            );
          }
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    credits: filter(state.credits, i => {
      return i.dateUsed === undefined;
    }),
    students: state.students,
    searchText: state.searchText
  };
}

export default connect(mapStateToProps)(MakeUpApp);
