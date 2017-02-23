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
    this.props.handleDeleteType("term");
  },

  render: function () {
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
         calendars.map((term, id) => {
          if (term.centreKey === centreKey) {
            html.push(<div style={{backgroundColor: '#9a9a9a', padding: '10px', color:'white', borderRadius: '5px 5px 0px 0px', marginTop: '5px'}} key={term.name}>
              {term.name}
              <button className="innerbtn" style={{float: 'right' }} onClick={(e) => this.openModal(e, term.key)}><Glyphicon glyph="trash" /> </button>

              <Link to={"/m/centres/"+centre.id+
                  "/"+id} activeClassName="active"><button className="innerbtn" style={{float: 'right'}}><Glyphicon glyph="pencil" /> </button></Link>

            </div>
          );
            term.terms.map((dates, id) => {
              html.push(<div style={{border: '1px solid #9a9a9a', padding: '10px'}} key={term.name+id}><b>Term {id} <font style={{color:'orange'}}>({_.size(term.terms[id])} sessions)</font></b><br/> {generateDates(term.terms[id])}</div>);
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
 });

 export default connect((state) => {return state;
})(TermList);
