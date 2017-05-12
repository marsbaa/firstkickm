import React from 'react';
import {Link} from 'react-router'
import {Glyphicon, Modal, FormGroup, Button, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import {connect} from 'react-redux';
import moment from 'moment'
import {innerbtn} from 'styles.css'
import TermDatesSelector from 'TermDatesSelector'


class TermList extends React.Component{
  openModal(e, id) {
    e.preventDefault();
    this.props.openModal();
    this.props.handleDeleteKey(id);
    this.props.handleDeleteType("term");
  }

  render() {
     var {centres, calendars} = this.props;
     var centreKey = this.props.centreKey;
     var html = [];
     var centre = {};
     centres.map((c) => {
       if(c.key === centreKey) {
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
     if (calendars.length !== 0) {
         Object.keys(calendars).map((id) => {
           var term = calendars[id]
          if (term.centreKey === centreKey) {
            html.push(<div style={{backgroundColor: '#9a9a9a', padding: '10px', color:'white', borderRadius: '5px 5px 0px 0px', marginTop: '5px'}} key={term.name}>
              {term.name}
              <button className="innerbtn" style={{float: 'right' }} onClick={(e) => this.openModal(e, term.key)}><Glyphicon glyph="trash" /> </button>

              <Link to={"/m/centres/"+centre.id+
                  "/"+term.key} activeClassName="active"><button className="innerbtn" style={{float: 'right'}}><Glyphicon glyph="pencil" /> </button></Link>

            </div>
          );
            Object.keys(term.terms).map((termId) => {
              html.push(<div style={{border: '1px solid #9a9a9a', padding: '10px'}} key={term.name+termId}><b>Term {termId} <font style={{color:'orange'}}>({_.size(term.terms[termId])} sessions)</font></b><br/> {generateDates(term.terms[termId])}</div>);
            });
          }
        });
      }



   return (
     <div>
       {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(TermList);
