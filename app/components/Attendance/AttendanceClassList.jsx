import React from 'react'
import Attendee from 'Attendee'
import {Row, Col} from 'react-bootstrap'
import moment from 'moment'

class AttendanceClassList extends React.Component{

    constructor(props){
      super(props)
      this.state = {
        show: true
      }
    }

    render() {
      var attended = 0
      var { group, date, name, makeUps} = this.props
      Object.keys(group).forEach((studentId) => {
        if (group[studentId].attendance !== undefined) {
          if (group[studentId].attendance[moment(date).format("YYYY-MM-DD")] !== undefined) {
            if (group[studentId].attendance[moment(date).format("YYYY-MM-DD")].attended) {
              attended = attended + 1;
            }
          }
        }
      });

      return(
        <div>
          <Row key={name} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}} onClick={()=> this.setState({show:this.state.show?false:true})}>
            <Col xs={9} md={9}>
              <h5>{name}</h5>
            </Col>
              <Col xs={3} md={3} style={{textAlign: 'center'}}>
                <h5><font style={{color: 'white'}}>{attended}</font> / {_.size(group)}
                </h5>
            </Col>
           </Row>
           {this.state.show? Object.keys(group).map((studentId) => {
                 var makeUp = _.find(makeUps, {studentKey: group[studentId].key})
                 if (makeUp !== undefined) {
                   if ( moment(date).isSame(makeUp.fromDate, 'day')){
                     return <Attendee key={group[studentId].key} student={group[studentId]} date={date} type='makeUpFrom'/>
                   }
                 }
                 else {
                   return <Attendee key={group[studentId].key} student={group[studentId]} date={date} type='normal'/>
                 }
             }):'' }
        </div>

      )
    }
}

export default AttendanceClassList
