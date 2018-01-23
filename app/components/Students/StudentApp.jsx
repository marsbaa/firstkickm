import React from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';
import {updateNavTitle, updateStudent} from 'actions';
import {isManager, getActive, getNotActive} from 'helper';
import StudentsFilter from 'StudentsFilter';
import filter from 'lodash/filter';
import Search from 'Search';
import StudentList from 'StudentList';

class StudentApp extends React.Component {
  componentWillMount() {
    let {dispatch, students} = this.props
    let activeStudents = getActive(students);
    Object
      .keys(activeStudents)
      .map(key => {
        const {currentClassTime} = activeStudents[key]
        if (currentClassTime === '4:00pm - 5:00pm') {
          let newData = {
            ...activeStudents[key],
            currentClassTime: '5:00pm - 6:00pm'
          }
          dispatch(updateStudent(activeStudents[key].key, newData))
        } else if (currentClassTime === '4:00pm - 5:30pm') {
          let newData = {
            ...activeStudents[key],
            currentClassTime: '4:30pm - 6:00pm'
          }
          dispatch(updateStudent(activeStudents[key].key, newData))
        }
      })
  }
  componentDidMount() {
    var {dispatch, selection} = this.props;
    dispatch(updateNavTitle('/m/students', selection.name));
  }
  render() {
    const {students, classes, manager} = this.props;
    let activeStudents = getActive(students);
    let notActiveStudents = getNotActive(students);
    return (
      <div>
        <Row
          style={{
          padding: '8px 10px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Col xs={7} md={7}>
            <Search type="student"/>
          </Col>
          <Col xs={5} md={5}>
            {manager
              ? <Link to="/m/students/add">
                  <button
                    className="btn"
                    style={{
                    backgroundColor: '#f5bb05',
                    margin: '0px',
                    float: 'right'
                  }}>
                    Add Student
                  </button>
                </Link>
              : null}
          </Col>
        </Row>
        {Object
          .keys(classes)
          .map(classKey => {
            const {day, startTime, endTime, ageGroup} = classes[classKey];

            let classTime = startTime + ' - ' + endTime;
            let title = ageGroup + ' ' + classTime + ' (' + day + ')';
            //Filter Students base on class
            let classStudents = _.filter(activeStudents, {
              currentClassDay: day,
              currentClassTime: classTime,
              ageGroup: ageGroup
            });
            return (<StudentList key={classKey} title={title} classStudents={classStudents}/>);
          })}
        <StudentList
          key={'inactive'}
          title={'Not Active'}
          classStudents={notActiveStudents}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    classes: filter(state.classes, {centreKey: state.selection.key}),
    students: StudentsFilter.filter(state.students, state.selection.id, state.searchText),
    manager: isManager(state.auth, state.users),
    selection: state.selection
  };
}

export default connect(mapStateToProps)(StudentApp);
