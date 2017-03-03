import React from 'react'
import {Glyphicon} from 'react-bootstrap'
import {Link} from 'react-router'


export var TermButton = React.createClass({
  getInitialState(){
    return {
      topColor: 'orange'
    }
  },

  handleSelect(e) {
    e.preventDefault()
    this.setState({
      topColor: '#5bc0de'
    })
  },

  render: function() {
    var title = this.props.title;
    var date = this.props.date;
    var displayDate = this.props.displayDate;
    var calendarKey = this.props.calendarKey;

  return (
    <Link to={"/m/coachschedule/"+calendarKey+"/"+date}>
      <table style={{textAlign:'center', float: 'left', width:'12%', margin:'0 1px'}}>
        <tbody>
        <tr style={{backgroundColor: this.state.topColor}}>
          <td style={{ color: '#656565', fontSize: '10px', padding: '2px', borderRadius:'5px 5px 0px 0px'}}>
            {title}
          </td>
        </tr>
        <tr style={{backgroundColor: '#656565'}} >
          <td style={{color: 'white', fontSize: '11px', padding: '2px', borderRadius:'0px 0px 5px 5px'}}>
            {displayDate}
          </td>
        </tr>
      </tbody>
      </table>
    </Link>
  );
}
});


export default (TermButton);
