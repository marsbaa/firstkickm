import React from 'react';
import {Link} from 'react-router'
import {Glyphicon, Modal, FormGroup, Button, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import {connect} from 'react-redux';
import moment from 'moment'
import {innerbtn} from 'styles.css'
import TermDatesSelector from 'TermDatesSelector'


export var TermList = React.createClass({

  saveTerm(e, centre) {
    e.preventDefault();
    var {dispatch, terms} = this.props;
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
      console.log(centre);
      if (typeof centre.term != 'undefined') {
        centre.terms[centre.terms.length] = {name: termName, terms};
      }
      else {
        centre.terms = [];
        centre.terms[0] = {name: termName, terms};
      }
      dispatch(actions.saveTerm(centre));
      this.close;
    }
  },

  render: function () {
     var {centres} = this.props;
     var centreId = this.props.centreId;
     var html = [];
     var centre = {};
     centres.map((c) => {
       if(c.id === centreId) {
         centre = c;
       }
     });
     if (centre.terms !== undefined) {
       var generateDates = (terms) => {
        terms.sort()
        var dates = ""
        terms.forEach((date) => {
           dates = dates + moment(date).format("DD MMM") + ", ";
         });
        return dates;
       };
       Object.keys(centre.terms).forEach((termId) => {
          var term = centre.terms[termId];
          html.push(<div style={{backgroundColor: '#9a9a9a', padding: '10px', color:'white', borderRadius: '5px 5px 0px 0px', marginTop: '5px'}} key={term.name}>
            {term.name}
            <button className="innerbtn" style={{float: 'right'}}><Glyphicon glyph="trash" /> </button>
          </div>
            )
          Object.keys(term.terms).forEach((termId) => {
            html.push(<div style={{border: '1px solid #9a9a9a', padding: '10px'}} key={termId}><b>Term {termId}</b> - {generateDates(term.terms[termId])}</div>);
          })
        });
      }



   return (
     <div>
       {html}
    </div>
   );
 }
 });

 export default connect((state) => {return state;
})(TermList);
