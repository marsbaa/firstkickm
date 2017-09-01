import React from 'react';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Student from 'Student';
var actions = require('actions');
import StudentsFilter from 'StudentsFilter';
import Search from 'Search';
import size from 'lodash/size';
import filter from 'lodash/filter';
import moment from 'moment';
import { getActive, getNotActive } from 'helper';

class StudentList extends React.Component {
  componentDidMount() {
    var { dispatch, selection } = this.props;
    dispatch(actions.updateNavTitle('/m/students', selection.name));
  }

  render() {
    const { students, searchText, selection, auth, users } = this.props;
    const user = _.find(users, ['email', auth.email]);
    var html = [];
    var filteredStudents = StudentsFilter.filter(
      students,
      selection.id,
      searchText
    );
    var activeStudents = getActive(filteredStudents);
    var notActiveStudents = getNotActive(filteredStudents);

    var classes = selection.classes;

    Object.keys(classes).forEach(classKey => {
      var { day, startTime, endTime, ageGroup, calendarKey } = classes[
        classKey
      ];

      var classTime = startTime + ' - ' + endTime;
      var classTimeDay = classTime + ' (' + day + ')';
      //Filter Students base on class

      var classStudents = _.filter(activeStudents, {
        currentClassDay: day,
        currentClassTime: classTime,
        ageGroup: ageGroup
      });

      if (_.size(classStudents) !== 0) {
        html.push(
          <div key={ageGroup + classTime + day}>
            <Row
              style={{
                backgroundColor: '#656565',
                padding: '0px 15px',
                color: '#ffc600'
              }}
            >
              <Col xs={8} md={8}>
                <h5>
                  {ageGroup} {classTime} ({day})
                </h5>
              </Col>
              <Col xs={4} md={4} style={{ textAlign: 'center' }}>
                <h5>
                  Class Size : {_.size(classStudents)}
                </h5>
              </Col>
            </Row>
            {Object.keys(classStudents).map(studentId => {
              var student = classStudents[studentId];
              return <Student key={student.key} student={student} />;
            })}
          </div>
        );
      }
    });

    if (notActiveStudents.length !== 0) {
      html.push(
        <div>
          <Row
            key="inactive"
            style={{
              backgroundColor: '#656565',
              padding: '0px 15px',
              color: '#ffc600'
            }}
          >
            <Col xs={8} md={8}>
              <h5>Not Active</h5>
            </Col>
            <Col xs={4} md={4} style={{ textAlign: 'center' }}>
              <h5>
                Count : {_.size(notActiveStudents)}
              </h5>
            </Col>
          </Row>
          {Object.keys(notActiveStudents).map(studentId => {
            const student = notActiveStudents[studentId];
            return <Student key={student.key} student={student} />;
          })}
        </div>
      );
    }

    return (
      <div>
        <Row
          style={{
            padding: '8px 10px',
            borderBottom: '1px solid #cccccc',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Col xs={7} md={7}>
            <Search type="student" />
          </Col>
          <Col xs={5} md={5}>
            {user.assignedRoles === 'Manager'
              ? <Link to="/m/students/add">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: '#f5bb05',
                      margin: '0px',
                      float: 'right'
                    }}
                  >
                    Add Student
                  </button>
                </Link>
              : null}
          </Col>
        </Row>

        {html}
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(StudentList);
