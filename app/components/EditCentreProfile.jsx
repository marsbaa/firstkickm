import React from 'react';
import {Panel,Col,FormControl} from 'react-bootstrap';
import formContainer from 'styles.css';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import "react-day-picker/lib/style.css"

export var EditCentreProfile = React.createClass({
  getInitialState: function() {
    return {
      selectedDay: new Date()
    };
  },

  handleDayClick(e, day) {
    this.setState({ selectedDay: day });
  },

  render: function () {

   return (
     <div className="formContainer">
       <form>
         <Col md={6}>
          <label>Centre ID</label>
          <FormControl
          style={{marginBottom: '10px'}}
          id="centreID"
          type="text"
          placeholder="Enter Centre ID"
          />
          <label>Centre Name</label>
          <FormControl
          style={{marginBottom: '10px'}}
          id="centreName"
          type="text"
          placeholder="Enter Centre Name"
          />
        </Col>
         <Col md={6}>
           <DayPicker numberOfMonths={ 2 } onDayClick={ this.handleDayClick } />

         </Col>
       </form>
     </div>
   );
 }
 });

 export default (EditCentreProfile);
