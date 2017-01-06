import React from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'
import TermDatesSelector from 'TermDatesSelector'
var actions = require('actions');
var {connect} = require('react-redux');
import {browserHistory} from 'react-router'
import {Link} from 'react-router'

export var EditTerm = React.createClass({
  getInitialState: function() {
    return {
      errorTermName: null,
      errorMessageTermName: ""
    };
  },
  goBack(e) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    browserHistory.push('/m/centres/'+ centreID);
  },

  saveTerm(e, centre) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    var {dispatch, terms} = this.props;
    var calendarKey = this.props.params.calendarKey;
    var termName = document.getElementById("termName").value;
    if (termName === "") {
      this.setState({
        errorTermName: 'error',
        errorMessageTermName: 'Field Empty. Please enter Term Name'
      });
    }
    else {
      this.setState({
        errorTermName: null,
        errorMessageTermName: ''
      });
      if (calendarKey === 'add') {
        dispatch(actions.addTerm(centre.key, terms, termName));
      }
      else {
        dispatch(actions.updateTerm(centre.key, terms, termName, calendarKey));
      }
      browserHistory.push('/m/centres/'+ centreID);
    }
  },

  componentWillUnmount(){
    var {dispatch} = this.props;
    dispatch(actions.resetTerms());
  },

  componentWillMount() {
    var {dispatch} = this.props;
    var centreID = this.props.params.centreID;
    var {centres} = this.props;
    var calendarKey = this.props.params.calendarKey;
    var centre = {};
    var term = {};
    if (centreID != '0') {
      centres.map((c) => {
        if(c.id === centreID) {
          centre = c;
        }
      });
      if (calendarKey !== 'add') {
        term = centre.calendars[calendarKey].term;
        dispatch(actions.startTerms(term));
      }

    }
  },



  render: function () {
    var centreID = this.props.params.centreID;
    var calendarKey = this.props.params.calendarKey;
    var {centres} = this.props;
    var centre = {};
    var term = {};
    var count = 0;
    var numOfTerms = 6;
    if (centreID != '0') {
      centres.map((c) => {
        if(c.id === centreID) {
          centre = c;
        }
      });
      if (calendarKey !== 'add') {
        term = centre.calendars[calendarKey];
        if (term !== undefined) {
          term.term.map((termID) => {
            count++;
          })
          numOfTerms = count;
        }
      }

    }

     return (
       <Grid>
         <Row>
           <Col md={6}>
             <FormGroup validationState={this.state.errorTermName}>
               <ControlLabel>Term Name</ControlLabel>
               <FormControl style={{marginBottom: '10px'}}
               id="termName"
               type="text"
               defaultValue={term.name}
               placeholder="Enter Name of Term"/>
             <HelpBlock>{this.state.errorMessageTermName}</HelpBlock>
             </FormGroup>
             <TermDatesSelector terms={term.term} mode={calendarKey} numOfTerms={numOfTerms}/>
             <Button onClick={this.goBack}>Cancel</Button>
             <Button onClick={(e) => this.saveTerm(e, centre)}>Save</Button>
          </Col>
        </Row>
      </Grid>
     );
   }
});

export default connect((state) => {return state;
})(EditTerm);
