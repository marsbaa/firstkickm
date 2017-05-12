import React from 'react'
import _ from 'lodash'
import {downbtn, datebtn} from 'styles.css'
var actions = require('actions')
var {connect} = require('react-redux')
import moment from 'moment'
import {Row, Col, ButtonGroup, Button, Panel} from 'react-bootstrap'

class PaymentDatesSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDates : [],
      deselectedDates : []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate !== this.props.startDate) {
      var {calendars} = this.props;
      var startDate = nextProps.startDate;
      var termKey = nextProps.termKey;
      var payerId = this.props.payerId;
      var selected = [];
      Object.keys(calendars).map((calendarKey) => {
        var calendar = calendars[calendarKey]
        if (calendar.key === termKey) {
          var count = 0;
          Object.keys(calendar.terms).map((termId) => {
            var term = calendar.terms[termId]
            var newTermDates = _.filter(term, (date) => {
              return moment(date) >= startDate
            });

            if (newTermDates.length > 0 && count < 2) {
              selected[termId] = newTermDates;
              if (newTermDates.length > 4) {
                count = 2;
              }
              else {
                count += 1;
              }
            }
          })
        }
      })
      this.setState({selectedDates : selected})
      this.props.onChange(selected, payerId);
    }

  }

  componentWillMount() {
    var {calendars} = this.props;
    var startDate = this.props.startDate;
    var termDates = this.props.termDates;
    var termKey = this.props.termKey;
    var payerId = this.props.payerId;
    var selected = [];
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (calendar.key === termKey) {
        var count = 0;
        Object.keys(calendar.terms).map((termId) => {
          var term = calendar.terms[termId]
          var newTermDates = _.filter(term, (date) => {
            return moment(date) >= startDate
          });
          newTermDates = _.filter(newTermDates, (date) => {
            return _.findIndex(termDates, (d) => {
              return moment(d).isSame(date)}) != -1
            })
          if (newTermDates.length > 0 && count < 2) {
            selected[termId] = newTermDates;
            if (newTermDates.length > 4) {
              count = 2;
            }
            else {
              count += 1;
            }
          }
        })
      }
    })
    this.setState({selectedDates : selected})
    this.props.onChange(selected, payerId);

  }

  handleDatesChange(e, date) {
    e.preventDefault();
    var payerId = this.props.payerId;
    var deselected = this.props.deselected;
    if (deselected === undefined) {
      deselected = []
    }
    if (e.target.className === "datebtn") {
      e.target.className = "downbtn"
      deselected.push(date);
    }
    else if (e.target.className === "downbtn"){
      e.target.className = "datebtn"
      var index = _.findIndex(deselected, (d) => {
           return moment(d).isSame(date)})
      _.pullAt(deselected, index)
    }
    this.props.onDeselect(deselected, payerId);
  }

  render() {

    var renderDatesButton = (dates) => {
      var html = [];
      dates.map((date) => {
          html.push(<button className="datebtn" key={date} style={{width: '25%', margin : '0px', height: '40px'}} onClick={(e) => { this.handleDatesChange(e, date)}}>{moment(date).format('D MMM')}</button>)
        })
      return html;
    }

    var html=[]
    this.state.selectedDates.map((term, termId) => {
      html.push(
        <Panel key={termId} header={<Row>
          <Col xs={8} md={8}>Term {termId}</Col>
          <Col xs={4} md={4}><font style={{fontSize: '14px', fontWeight: 'normal', float: 'right', textDecoration: 'underline'}}>Sessions: {term.length}</font></Col>
        </Row>}>
           <ButtonGroup key={termId} style={{width: '100%'}}>
            {renderDatesButton(term)}
          </ButtonGroup>
        </Panel>
      )
    })



   return (
     <div>
      {html}
     </div>

   );
 }
 }

 export default connect((state) => {return state;
})(PaymentDatesSelector);
