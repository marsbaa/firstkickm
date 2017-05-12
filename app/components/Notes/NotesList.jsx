import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import {Grid, Row, Col,FormGroup, InputGroup, FormControl, Button, HelpBlock} from 'react-bootstrap'
import moment from 'moment'

class NotesList extends React.Component {

  constructor(props) {
    super(props);
    this.deleteNote = this.deleteNote.bind(this)
  }

  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/notes", selection.name+" Notes"));
    window.scrollTo(0,0)
  }

  handleSend(e) {
    e.preventDefault()
    var {dispatch, selection, auth, users} = this.props
    var user = _.find(users, ['email', auth.email])
    var message = document.getElementById('message').value
    var whitespacemessage = message.replace(/\s/g, '')
    if (whitespacemessage !== "") {
      var note = {
        centreKey: selection.key,
        email : auth.email,
        name : user.name,
        date: moment().format("DD MMM YYYY"),
        message
      }
      dispatch(actions.addNote(note))
    }
    else {
      console.log("Empty")
    }
  }

  deleteNote(key) {
    var {dispatch} = this.props;
    dispatch(actions.deleteNote(key))
  }

  render() {
    var {notes, auth, selection} = this.props
    var filteredNotes = _.filter(notes, {centreKey : selection.key})
   return (
     <Grid style={{marginTop : '20px'}}>
       <Row>
         <Col xs={12} md={12} lg={12}>
           <FormGroup>
             <InputGroup>
               <FormControl id='message' componentClass="textarea" style={{height: '50px'}}/>
               <InputGroup.Addon>
                 <Button style={{textShadow: 'none'}} onClick={
                     this.handleSend.bind(this)
                     }>Send</Button>
              </InputGroup.Addon>
             </InputGroup>
           </FormGroup>
         </Col>
       </Row>
       <Row>
         <Col xs={12} md={12} lg={12}>
           {filteredNotes.map((note) => {
             return <FormGroup key={note.key}>
               <InputGroup>
                 <InputGroup.Addon>
                  <input type="checkbox" aria-label="..." />
                </InputGroup.Addon>
                 <FormControl id='message' componentClass="textarea" style={{height: '50px'}} disabled value={note.message}/>
               </InputGroup>
               <HelpBlock style={{textAlign: 'right', fontSize: '10px'}}><i>- by {note.name} on {note.date} {note.email === auth.email ? <button className="btn" onClick={(e) => {e.preventDefault();
                 this.deleteNote(note.key)}}>Delete</button> : null}</i></HelpBlock>
             </FormGroup>
           })}
         </Col>
       </Row>
     </Grid>

   );
 }
 }

 export default connect((state) => {return state;
})(NotesList);
