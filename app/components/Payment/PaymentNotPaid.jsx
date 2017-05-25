import React from 'react';
import {Link} from 'react-router'
import {Row, Col, FormGroup, FormControl, Badge, ProgressBar,Label} from 'react-bootstrap'
import {connect} from 'react-redux';
import PaymentClassList from 'PaymentClassList'
var actions = require('actions');
import StudentsFilter from 'StudentsFilter'
import _ from 'lodash'
import moment from 'moment'

class PaymentNotPaid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTerm: 3,
      selectedYear : moment().year()
    }
  }

  handleSelect(e) {
    this.setState({selectedTerm : e.target.value})
  }

  handleSelectYear(e) {
    e.preventDefault()
    this.setState({year : e.target.value})
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
    dispatch(actions.updateNavTitle("/m/payment/report", selection.name+" Not Paid List"));
  }


  render() {
    var {selection, calendars} = this.props;
    var classes = selection.classes
    var html = []
    Object.keys(classes).forEach((classKey)=> {
      html.push(<PaymentClassList key={classKey} classes={classes[classKey]} selectedTerm={this.state.selectedTerm}/>)
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
    var yearOptions = [];
    yearOptions.push(<option key={moment().year()} value={moment().year()}>{moment().year()}</option>);
    yearOptions.push(<option key={moment().year()-1} value={moment().year()-1}>{moment().year()-1}</option>);

   return (
     <div>
        <Row style={{backgroundColor: '#ffc600', color: '#656565', padding: '15px 15px 5px 15px'}}>
          <Col xs={3} md={3}>
          <FormGroup>
            <FormControl style={{padding: '6px 6px 5px 2px'}}
              id="yearSelect" componentClass="select" placeholder="select" defaultValue={this.state.selectedYear} onChange={this.handleSelectYear.bind(this)}>
              {yearOptions}
            </FormControl>
          </FormGroup>
        </Col>
         <Col xs={4} md={4} lg={4} style={{paddingLeft: '0px'}}>
           <FormGroup>
            <FormControl id="termSelect" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}>
              <option value="select">select</option>
              {termOptions}
            </FormControl>
          </FormGroup>
         </Col>
         <Col xs={5} md={5} lg={5}>
           <button className="btn" style={{float: 'right', height: '34px'}}>Send Reminder</button>
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(PaymentNotPaid);
