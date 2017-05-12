import React from 'react';
import {Link} from 'react-router'
import {Panel,Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
var actions = require('actions');
import {PieChart, Pie, Legend, Tooltip} from 'recharts'
import moment from 'moment'
import StudentsFilter from 'StudentsFilter'

const data01 = [{name: 'Collected', value: 400}, {name: 'Owing', value: 300}]


class ChartsCollectionPieChart extends React.Component{

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
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.centreKey === selection.key) {
        var terms = calendar.terms;
        terms.map((term, id) => {
          if(moment().isBetween(term[0], term[term.length-1])) {
            document.getElementById('termSelectCollections').value = id
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
         <Panel header={
             <Row>
               <Col xs={7} md={7} lg={7}>
                  <h5>Collections</h5>
               </Col>
               <Col xs={5} md={5} lg={5}>
                 <FormGroup>
                  <FormControl id="termSelectCollections" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}>
                    <option value="select">select</option>
                    {termOptions}
                  </FormControl>
                </FormGroup>
               </Col>
             </Row>



           } style={{marginTop: '15px'}}>
           <PieChart width={800} height={400}>
            <Pie isAnimationActive={false} data={data01} cx={200} cy={200} outerRadius={80} fill="#8884d8" label/>
            <Tooltip/>
           </PieChart>
         </Panel>
   );
  }
 }


 export default connect((state) => {return state;
})(ChartsCollectionPieChart);
