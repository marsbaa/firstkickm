import React from 'react'
import {Glyphicon} from 'react-bootstrap'
import {Link} from 'react-router'
import moment from 'moment'


class TermButton extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      topColor: '#f5bb05'
    }
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(e) {
    e.preventDefault()
    this.setState({
      topColor: '#5bc0de'
    })
  }

  render() {
    var title = this.props.title;
    var date = this.props.date;
    var displayDate = this.props.displayDate;
    var calendarKey = this.props.calendarKey;

  return (
    <Link to={"/m/coachschedule/"+calendarKey+"/"+date}>
      <table style={{textAlign:'center', float: 'left', width:'11.5%', margin:'0 1px'}}>
        <tbody>
        <tr style={{backgroundColor: this.state.topColor}}>
          <td style={{ color: '#656565', fontSize: '10px', padding: '2px', borderRadius:'5px 5px 0px 0px'}}>
            {title}
          </td>
        </tr>
        <tr style={{backgroundColor: '#656565'}} >
          <td style={{color: 'white', fontSize: '12px', padding: '1px', borderRadius:'0px 0px 5px 5px'}}>
            {moment(date).format('MMM')}<br/>
          {moment(date).format('D')}
          </td>
        </tr>
      </tbody>
      </table>
    </Link>
  );
}
}


export default (TermButton);
