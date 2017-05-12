import React from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap'
import TermDatesSelector from 'TermDatesSelector'
var actions = require('actions');
var {connect} = require('react-redux');
import {browserHistory} from 'react-router'
import {Link} from 'react-router'

class TermEdit extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      errorTermName: null,
      errorMessageTermName: ""
    }
  }

  goBack(e) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    browserHistory.push('/m/centres/'+ centreID);
  }

  saveTerm(e, centreKey) {
    e.preventDefault();
    var centreID = this.props.params.centreID;
    var {dispatch, terms, calendars} = this.props;
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
        dispatch(actions.addTerm(centreKey, terms, termName));
      }
      else {
        dispatch(actions.updateTerm(centreKey, terms, termName, calendars[calendarKey].key));
      }
      browserHistory.push('/m/centres/'+ centreID);
    }
  }

  componentWillUnmount(){
    var {dispatch} = this.props;
    dispatch(actions.resetTerms());
  }

  componentWillMount() {
    var {dispatch} = this.props;
    var centreID = this.props.params.centreID;
    var {calendars} = this.props;
    var calendarKey = this.props.params.calendarKey;
    if (calendarKey !== 'add') {
        var terms = calendars[calendarKey].terms;
        dispatch(actions.startTerms(terms));
      }
  }



  render() {
    var centreID = this.props.params.centreID;
    var calendarKey = this.props.params.calendarKey;
    var {centres, calendars} = this.props;
    var term = {};
    var count = 0;
    var numOfTerms = 6;
    var centre = {};
    centres.map((c) => {
      if(c.id === centreID) {
        centre = c;
      }
    });

    if (calendarKey !== 'add') {
      term = calendars[calendarKey];
      if (term !== undefined) {
        Object.keys(term.terms).map((termID) => {
          count++;
        })
          numOfTerms = count;
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
             <TermDatesSelector mode={calendarKey} numOfTerms={numOfTerms}/>
             <Button onClick={this.goBack}>Cancel</Button>
             <Button onClick={(e) => this.saveTerm(e, centre.key)}>Save</Button>
          </Col>
        </Row>
      </Grid>
     );
   }
}

export default connect((state) => {return state;
})(TermEdit);
