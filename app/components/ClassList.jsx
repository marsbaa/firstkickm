import React from 'react';
import {Link} from 'react-router'
import {Glyphicon, Modal, FormGroup, Button, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import {connect} from 'react-redux';
import moment from 'moment'
import {innerbtn} from 'styles.css'
import TermDatesSelector from 'TermDatesSelector'


export var ClassList = React.createClass({
  openModal(e, id) {
    e.preventDefault();
    this.props.openModal();
    this.props.handleDeleteKey(id);
    this.props.handleDeleteType("class");
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

     if (centre.classes !== undefined) {
       Object.keys(centre.classes).forEach((classId)=> {
         var classes = centre.classes[classId];
         html.push(<div style={{border: '1px solid #9a9a9a', padding: '10px'}} key={classId}>
           {classes.ageGroup + " " + classes.day + " " + classes.startTime + " - " + classes.endTime}
           <button className="innerbtn" style={{float: 'right' }} onClick={(e) => this.openModal(e, classId)}><Glyphicon glyph="trash" /> </button>
         </div>)
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
})(ClassList);
