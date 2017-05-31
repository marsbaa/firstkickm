import React from 'react'
import {Link} from 'react-router'
import {Glyphicon} from 'react-bootstrap'
import {connect} from 'react-redux'
import moment from 'moment'
import TermDatesSelector from 'TermDatesSelector'


class CalendarList extends React.Component{

  openModal(e, id) {
    e.preventDefault();
    this.props.openModal();
    this.props.handleDeleteKey(id);
    this.props.handleDeleteType("calendar");
  }

  render() {
    var {centres, calendars, centreKey} = this.props
    var html = []

    var generateDates = (terms) => {
     terms.sort()
     var dates = ""
     terms.map((date) => {
        dates = dates + moment(date).format("DD MMM") + ", ";
      });
     return dates;
    }

     Object.keys(calendars).map((id) => {
       var calendar = calendars[id]
       if (calendar.centreKey === centreKey) {
         html.push(
           <div style={{backgroundColor: '#9a9a9a', padding: '10px', color:'white', borderRadius: '5px 5px 0px 0px', marginTop: '5px'}} key={calendar.name}>
             {calendar.name}
             <button className="innerbtn" style={{float: 'right' }} onClick={(e) => this.openModal(e, calendar.key)}>
               <Glyphicon glyph="trash" />
             </button>
             <Link
               to={"/m/centres/"+centreKey+"/"+calendar.key} activeClassName="active">
               <button className="innerbtn" style={{float: 'right'}}>
                 <Glyphicon glyph="pencil" />
               </button>
             </Link>
           </div>
         )
         Object.keys(calendar.terms).map((termId) => {
           html.push(
             <div style={{border: '1px solid #9a9a9a', padding: '10px'}} key={calendar.name+termId}>
               <b>Term {termId} 
                 <font style={{color:'orange'}}>
                    ({_.size(calendar.terms[termId])} sessions)
                 </font>
               </b>
               <br/>
               {generateDates(calendar.terms[termId])}
             </div>)
         })
       }
     })

   return (
     <div>
       {html}
     </div>
   )
 }
}


export default connect((state) => {return state;
})(CalendarList);
