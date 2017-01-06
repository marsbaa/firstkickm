import React from 'react';
import {Link} from 'react-router'
import {Glyphicon, Modal, FormGroup, Button, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import {connect} from 'react-redux';
import moment from 'moment'
import {innerbtn} from 'styles.css'
import TermDatesSelector from 'TermDatesSelector'


export var TermList = React.createClass({
  openModal(e, id) {
    e.preventDefault();
    this.props.openModal();
    this.props.handleDeleteKey(id);
  },

  render: function () {
     var {centres} = this.props;
     var centreID = this.props.centreId;
     var html = [];
     var centre = {};
     centres.map((c) => {
       if(c.id === centreID) {
         centre = c;
       }
     });

     var generateDates = (terms) => {
      terms.sort()
      var dates = ""
      terms.map((date) => {
         dates = dates + moment(date).format("DD MMM") + ", ";
       });
      return dates;
     };

     if (centre.calendars !== undefined) {
       Object.keys(centre.calendars).forEach((termId) => {
          var term = centre.calendars[termId];
          html.push(<div style={{backgroundColor: '#9a9a9a', padding: '10px', color:'white', borderRadius: '5px 5px 0px 0px', marginTop: '5px'}} key={term.name}>
            {term.name}
            <button className="innerbtn" style={{float: 'right' }} onClick={(e) => this.openModal(e, termId)}><Glyphicon glyph="trash" /> </button>

            <Link to={"/m/centres/"+centreID+
                "/"+termId} activeClassName="active"><button className="innerbtn" style={{float: 'right'}}><Glyphicon glyph="pencil" /> </button></Link>

          </div>
            )
          Object.keys(term.term).forEach((termId) => {
            html.push(<div style={{border: '1px solid #9a9a9a', padding: '10px'}} key={term.name+termId}><b>Term {termId} <font style={{color:'orange'}}>({_.size(term.term[termId])} sessions)</font></b><br/> {generateDates(term.term[termId])}</div>);
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
