import React from 'react'
import _ from 'lodash'
import {downbtn, datebtn} from 'styles.css'
var actions = require('actions')
var {connect} = require('react-redux')
import moment from 'moment'
import {Row, Col, ButtonGroup, Button, Panel} from 'react-bootstrap'

class PaymentDatesSelector extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedDates : [],
      deselectedDates : []
    };
  }

  componentWillMount() {
    var {calendars} = this.props
    var startDate = this.props.startDate
    var calendarDates = this.props.calendarDates
    var calendarKey = this.props.calendarKey
    var payerId = this.props.payerId

    var calendar = calendars[calendarKey]
    var count = 0;
    var selected = [];
    Object.keys(calendar.terms).map((termId) => {
      var term = calendar.terms[termId]
      var newTermDates = _.filter(term, (date) => {
        return moment(date) >= startDate
      });
      newTermDates = _.filter(newTermDates, (date) => {
        return _.findIndex(calendarDates, (d) => {
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

    this.setState({selectedDates : selected})
    this.props.onChange(selected, payerId)

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate !== this.props.startDate) {
      var {calendars} = this.props
      var startDate = nextProps.startDate
      var calendarDates = this.props.calendarDates
      var calendarKey = nextProps.calendarKey
      var payerId = this.props.payerId

      var calendar = calendars[calendarKey]
      var selected = []
      var count = 0
      Object.keys(calendar.terms).map((termId) => {
        var term = calendar.terms[termId]
        var newTermDates = _.filter(term, (date) => {
          return moment(date) >= startDate
        });
        newTermDates = _.filter(newTermDates, (date) => {
          return _.findIndex(calendarDates, (d) => {
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

      this.setState({selectedDates : selected})
      this.props.onChange(selected, payerId)
    }
  }

  handleDatesChange(e, date) {
    e.preventDefault()
    var payerId = this.props.payerId
    var deselected = this.props.deselected
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
    this.props.onDeselect(deselected, payerId)
  }

  render() {
    var student = this.props.student
    var html=[]
    this.state.selectedDates.map((term, termId) => {
      html.push(
        <Panel key={termId} header={<Row>
          <Col xs={8} md={8}>Term {termId}</Col>
          <Col xs={4} md={4}><font style={{fontSize: '14px', fontWeight: 'normal', float: 'right', textDecoration: 'underline'}}>Sessions: {term.length}</font></Col>
        </Row>}>
          <ButtonGroup key={termId} style={{width: '100%'}}>
            {
              term.map((date) => {
                var attended = false
                if (student.attendance !== undefined) {
                  if (student.attendance[moment(date).format('YYYY-MM-DD')] !== undefined) {
                    if (student.attendance[moment(date).format('YYYY-MM-DD')].attended) {
                      attended = true
                    }
                  }
                }
                if (attended) {
                  return (
                    <button className="datebtn" key={date} style={{width: '25%', margin : '0px', height: '40px', backgroundColor:'green'}} >
                      {moment(date).format('D MMM')}
                    </button>
                  )
                }
                else {
                  return (
                    <button className="datebtn" key={date} style={{width: '25%', margin : '0px', height: '40px'}} onClick={(e) => { this.handleDatesChange(e, date)}}>
                      {moment(date).format('D MMM')}
                    </button>
                  )
                }

              })
            }
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
