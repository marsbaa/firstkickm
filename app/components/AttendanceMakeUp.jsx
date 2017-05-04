import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
var {connect} = require('react-redux')
var actions = require('actions')
import {Panel, Grid, Row, Col, FormControl, FormGroup, ControlLabel, Radio} from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

class AttendanceMakeUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fromDate : moment(),
      fromTermDates : []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/attendance/HQ", "Make Up Form"));
   }

   componentWillMount() {
     var {selection, calendars} = this.props;
     var termDates = [];
     calendars.map((calendar) => {
       if(calendar.centreKey === selection.key) {
         calendar.terms.map((term, termId) => {
           term.map((date) => {
             date = moment(date).format("YYYYMMDD")
             if(moment(date).isSameOrAfter()) {
               termDates.push(moment(date));
             }
           })
         })
       }
     })
     this.setState({startDate: termDates[0]})
     this.setState({fromTermDates: termDates})
   }

   handleChange(date) {
     this.setState({
       startDate: date
     });
   }

  centreSelect(e) {
    e.preventDefault();
    this.setState({
      selectedCentre: e.target.value
    });
  }


  onFormSubmit(e) {
    e.preventDefault();

  }

  render() {


    return (
      <Grid style={{marginTop: '20px'}}>
        <Panel header="From">
          <Row style={{padding: '10px'}}>
            <Col md={6}>
              <FormGroup>
                <ControlLabel>Selected Date</ControlLabel>
                  <DatePicker
                    id = "datePicker"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.startDate}
                    includeDates={this.state.termDates}
                    onChange={this.handleChange}
                    />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Selected Centre</ControlLabel>
                <FormControl
                  id="centreSelect" componentClass="select" placeholder="select"
                  onChange={this.centreSelect.bind(this)}>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Selected Class Time</ControlLabel>
                <FormControl
                  id="timeSlotSelect" componentClass="select" placeholder="select"
                  >
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
        </Panel>
        <Panel header="To">
          <Row style={{padding: '10px'}}>
            <Col md={6}>
              <FormGroup>
                <ControlLabel>Selected Date</ControlLabel>
                  <DatePicker
                    id = "datePicker"
                    dateFormat="YYYY-MM-DD"
                    selected={this.state.startDate}
                    includeDates={this.state.termDates}
                    onChange={this.handleChange}
                    />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Selected Centre</ControlLabel>
                <FormControl
                  id="centreSelect" componentClass="select" placeholder="select"
                  onChange={this.centreSelect.bind(this)}>

                </FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Selected Class Time</ControlLabel>
                <FormControl
                  id="timeSlotSelect" componentClass="select" placeholder="select"
                  >

                </FormControl>
              </FormGroup>
            </Col>
          </Row>
        </Panel>
        <button className="submitbtn" onClick={this.onFormSubmit.bind(this)}>Save Child Profile</button>
      </Grid>

    )
  }
}

export default connect(
  (state) => {
    return state;
  }
)(AttendanceMakeUp);
