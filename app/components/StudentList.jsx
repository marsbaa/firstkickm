import React from 'react';
import {Link} from 'react-router'
import {Row, Col, Glyphicon, Modal, Button} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import Student from 'Student'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import Search from 'Search'
import _ from 'lodash'
import moment from 'moment'
import Papa from 'papaparse'

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      studentsName : []
    }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/students", selection.name));
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleChange (e) {
    var {dispatch, students} = this.props
    var studentsName = []
    Papa.parse(e.target.files[0],
      {
        delimiter: "",
        newline: "",
        header: true,
        complete: function(results, file) {
	         Object.keys(results.data).map((id)=> {
             var student = results.data[id]
             studentsName.push(student.childName)
             dispatch(actions.addStudent(student))
           })
     }})
    this.setState({studentsName})
    this.open()
  }



  render() {
    var {students, searchText, selection} = this.props;

    var html=[];
    var filteredStudents = StudentsFilter.filter(students, selection.id, searchText);
    if (filteredStudents.length !== 0) {
      var groupTime = _.groupBy(filteredStudents, 'currentClassTime');
      Object.keys(groupTime).forEach((timeSlot)=> {
        var groupAge = _.groupBy(groupTime[timeSlot], 'ageGroup');
        Object.keys(groupAge).forEach((age)=> {
          var group = groupAge[age];
          html.push( <Row key={age+timeSlot} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
             <Col xs={8} md={8}>
               <h5>{age} {timeSlot}</h5>
             </Col>
               <Col xs={4} md={4} style={{textAlign: 'center'}}>
                 <h5>Class Size: {_.size(group)}</h5>
             </Col>
           </Row>);

           Object.keys(group).forEach((studentId) => {
               html.push(<Student key={group[studentId].key} student={group[studentId]}/>);

           })
        })
      })
    }
    var studentHTML = [];
    this.state.studentsName.map((name) => {
      studentHTML.push(<div key={name}>
        {name}
      </div>)
    })

   return (
     <div>

       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={7} md={7}>
           <Search type="student" />
         </Col>
         <Col xs={5} md={5}>
         <Link to="/m/students/add"><button className="btn" style={{backgroundColor: '#f5bb05', margin: '0px'}}>Add Student</button></Link>
           <input name="file" id="file" className="inputfile" type="file" accept=".csv" onChange={this.handleChange.bind(this)} />
           <label htmlFor="file"><Glyphicon glyph="upload" /></label>
         </Col>
       </Row>
       <Modal show={this.state.showModal} onHide={this.close}>
       <Modal.Header closeButton>
         <b>Students Added :</b>
       </Modal.Header>
       <Modal.Body>
         {studentHTML}
       </Modal.Body>
       <Modal.Footer>
         <Button onClick={this.close}>Close</Button>
       </Modal.Footer>
     </Modal>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(StudentList);
