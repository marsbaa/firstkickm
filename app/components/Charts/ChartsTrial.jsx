import React from 'react';
import {Link} from 'react-router'
import {Panel,Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
var actions = require('actions');
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text} from 'recharts'
import moment from 'moment'
import TrialsFilter from 'TrialsFilter'


class ChartsTrial extends React.Component{

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
    var {trials, calendars, selection} = this.props;
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        var terms = calendar.terms;
        terms.map((term, id) => {
          console.log(term[0])
          console.log(term[term.length-1])
          if(moment().isBetween(term[0], term[term.length-1], null, '[]')) {
            document.getElementById('termSelect').value = id
            this.setState({selectedTerm: id})
          }
        })
      }
    })
  }

  render() {
    var {trials, calendars, selection} = this.props;
    var filteredTrials = TrialsFilter.filter(trials, selection.id, "")
    var termOptions = []
    var data = []
    var termId = this.state.selectedTerm
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
    if (termId !== '0') {
      if(terms[termId] !== undefined) {
        terms[termId].map((date)=> {
          var trialsSignUp = _.filter(filteredTrials, {dateOfTrial : moment(date).format('YYYY-MM-DD')})
          var trialsAttended = _.filter(trialsSignUp, {attended: true})
          data.push({name: moment(date).format("D MMM"), leads: _.size(trialsSignUp), attended: _.size(trialsAttended)})
        })
      }
    }

   return (
         <Panel header={
             <Row>
               <Col xs={7} md={7} lg={7}>
                  <h5>Trials</h5>
               </Col>
               <Col xs={5} md={5} lg={5}>
                 <FormGroup>
                  <FormControl id="termSelect" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}>
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
             <Bar dataKey="leads" fill="#8884d8" />
             <Bar dataKey="attended" fill="#82ca9d" />
            </BarChart>
           </ResponsiveContainer>
         </Panel>
   );
  }
 }


 export default connect((state) => {return state;
})(ChartsTrial);
