import React from 'react';
import {Link} from 'react-router'
import {Panel,Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
var actions = require('actions');
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text} from 'recharts'
import moment from 'moment'
import StudentsFilter from 'StudentsFilter'


class ChartsStudent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      selectedTerm : ''
    }
  }

  handleSelect(e) {
    console.log(e.target.value)
    this.setState({selectedTerm : e.target.value})
  }

  componentDidMount() {
    var {calendars, selection} = this.props;
    calendars.map((calendar) => {
      if (calendar.centreKey === selection.key) {
        var terms = calendar.terms;
        terms.map((term, id) => {
          if(moment().isBetween(term[0], term[term.length-1])) {
            document.getElementById('termSelectStudents').value = id
            this.setState({selectedTerm: id})
          }
        })
      }
    })
  }

  render() {
    var {students, calendars, selection} = this.props;
    var filteredStudents= StudentsFilter.filter(students, selection.id, "")
    var termOptions = []
    var data = []
    var termId = this.state.selectedTerm
    var terms;
    calendars.map((calendar) => {
      if (calendar.centreKey === selection.key) {
        terms = calendar.terms;
        terms.map((term, id) => {
          termOptions.push(<option key={selection.key+id} value={id}>Term {id}</option>)
        })
      }
    })
    if (termId !== '0') {
      if(terms[termId] !== undefined) {
        terms[termId].map((date)=> {
          data.push({
            name: moment(date).format("D MMM"),
            U6: _.size(_.filter(filteredStudents, {ageGroup: 'U6'})),
            U8: _.size(_.filter(filteredStudents, {ageGroup: 'U8'})),
            U10: _.size(_.filter(filteredStudents, {ageGroup: 'U10'})),
            U12: _.size(_.filter(filteredStudents, {ageGroup: 'U12'})),
            U14: _.size(_.filter(filteredStudents, {ageGroup: 'U14'}))
           })
        })
      }
    }

   return (
     <Row>
       <Col md={6} xs={12}>
         <Panel header={
             <Row>
               <Col xs={7} md={7} lg={7}>
                  <h5>Students</h5>
               </Col>
               <Col xs={5} md={5} lg={5}>
                 <FormGroup>
                  <FormControl id="termSelectStudents" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}>
                    <option value="select">select</option>
                    {termOptions}
                  </FormControl>
                </FormGroup>
               </Col>
             </Row>



           } style={{marginTop: '15px'}}>
           <ResponsiveContainer minWidth= {300} aspect={2}>
             <BarChart width={600} height={300} data={data}
                  margin={{top: 20, right: 30, left: 20, bottom: 5}}>
             <XAxis dataKey="name"/>
             <YAxis/>
             <CartesianGrid strokeDasharray="3 3"/>
             <Tooltip/>
             <Legend />
             <Bar dataKey="U6" stackId="a" fill='#8884d8' />
             <Bar dataKey="U8" stackId="a" fill='#83a6ed' />
             <Bar dataKey="U10" stackId="a" fill='#8dd1e1' />
             <Bar dataKey="U12" stackId="a" fill='#82ca9d' />
             <Bar dataKey="U14" stackId="a" fill='#a4de6c' />
            </BarChart>
           </ResponsiveContainer>
         </Panel>
       </Col>
     </Row>
   );
  }
 }


 export default connect((state) => {return state;
})(ChartsStudent);
