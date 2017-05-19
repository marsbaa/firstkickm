import React from 'react';
import {Grid, Row, Col, FormGroup, FormControl} from 'react-bootstrap'
import {connect} from 'react-redux';
var actions = require('actions');
import _ from 'lodash'
import moment from 'moment'
import AttendanceTable from 'AttendanceTable'

class AttendanceSummary extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: 3
    }
  }
  handleSelect(e) {
    this.setState({selectedTerm : e.target.value})
  }


  componentDidMount () {
    var {dispatch, selection, calendars} = this.props;
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        var terms = calendar.terms;
        terms.map((term, id) => {
          if(moment().isBetween(term[0], term[term.length-1], null, '[]')) {
            document.getElementById('termSelect').value = id
            this.setState({selectedTerm: id})
          }
        })
      }
    })
  dispatch(actions.updateNavTitle("/m/attendance/summary", selection.name+" Attendance Summary"));
  }

  render() {
    var {selection, calendars} = this.props;
    var classes = selection.classes
    var html = []
    Object.keys(classes).forEach((classKey)=> {
      html.push(<AttendanceTable key={classKey} classes={classes[classKey]} selectedTerm={this.state.selectedTerm}/>)
    })

    var termOptions = []
    var terms;
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        terms = calendar.terms;
        terms.map((term, id) => {
          termOptions.push(<option key={selection.key+id} value={id}>Term {id}</option>)
        })
      }
    })


   return (
     <Grid style={{marginTop: '20px'}}>
       <Row>
         <Col xs={12} md={12} lg={12}>
           <FormGroup>
            <FormControl id="termSelect" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}>
              <option value="select">select</option>
              {termOptions}
            </FormControl>
          </FormGroup>
         </Col>
       </Row>
       <Row>
         <Col xs={12} md={12}>
           {html}
         </Col>
       </Row>

     </Grid>
   );
 }
 }

 export default connect((state) => {return state;
})(AttendanceSummary);
