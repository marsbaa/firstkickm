import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { updateNavTitle } from 'actions';
import { isManager, getActive, getNotActive } from 'helper';
import StudentsFilter from 'StudentsFilter';
import filter from 'lodash/filter';
import Search from 'Search';
import StudentXList from 'StudentXList';

class StudentTransfer extends React.Component {
  componentDidMount() {
    var { dispatch, selection } = this.props;
    dispatch(updateNavTitle('/m/students', selection.name));
  }
  render() {
    const { students, classes } = this.props;
    let activeStudents = getActive(students);
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
          </Col>
        </Row>
        {Object.keys(classes).map(classKey => {
          const { day, startTime, endTime, ageGroup } = classes[classKey];

          let classTime = startTime + ' - ' + endTime;
          let title = ageGroup + ' ' + classTime + ' (' + day + ')';
          //Filter Students base on class
          let classStudents = _.filter(activeStudents, {
            currentClassDay: day,
            currentClassTime: classTime,
            ageGroup: ageGroup
          });
          return (
            <StudentXList
              key={classKey}
              title={title}
              classStudents={classStudents}
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    classes: filter(state.classes, { centreKey: state.selection.key }),
    students: StudentsFilter.filter(
      state.students,
      state.selection.id,
      state.searchText
    ),
    selection: state.selection
  };
}

export default connect(mapStateToProps)(StudentTransfer);
