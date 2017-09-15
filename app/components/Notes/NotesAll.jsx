import React from 'react';
import _ from 'lodash';
var actions = require('actions');
var { connect } = require('react-redux');
import {
  Grid,
  Row,
  Col,
  FormGroup,
  InputGroup,
  FormControl,
  Button,
  HelpBlock,
  ButtonGroup
} from 'react-bootstrap';
import moment from 'moment';

class NotesAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'current'
    };
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentDidMount() {
    var { dispatch, selection } = this.props;
    dispatch(actions.updateNavTitle('/m/notes/all', 'Notes Inbox'));
    window.scrollTo(0, 0);
  }

  handleSelect(e) {
    e.preventDefault();
    var id = e.target.id;
    var className = e.target.className;
    if (id === 'current' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('archived').className =
        'normalbtn btn btn-default';
      this.setState({ filter: 'current' });
    } else if (id === 'archived' && className === 'normalbtn btn btn-default') {
      e.target.className = 'selectedbtn btn btn-default';
      document.getElementById('current').className =
        'normalbtn btn btn-default';
      this.setState({ filter: 'archived' });
    }
  }

  handleSend(e) {
    e.preventDefault();
    var { dispatch, selection, auth, users } = this.props;
    var user = _.find(users, ['email', auth.email]);
    var message = document.getElementById('message').value;
    var whitespacemessage = message.replace(/\s/g, '');
    if (whitespacemessage !== '') {
      var note = {
        centreKey: selection.key,
        email: auth.email,
        name: user.name,
        date: moment().format('DD MMM YYYY'),
        message
      };
      dispatch(actions.addNote(note));
    } else {
      console.log('Empty');
    }
  }

  deleteNote(key) {
    var { dispatch } = this.props;
    dispatch(actions.deleteNote(key));
  }

  render() {
    var { notes, auth, selection, centres, users, dispatch } = this.props;
    var user = _.find(users, ['email', auth.email]);
    notes = _.sortBy(notes, o => {
      return moment(o.date).format();
    }).reverse();
    return (
      <Grid style={{ marginTop: '20px' }}>
        <Row style={{ textAlign: 'center', margin: '10px 10px' }}>
          <Col xs={12} md={12}>
            <ButtonGroup>
              <Button
                id="current"
                style={{ margin: '0px' }}
                className="selectedbtn"
                onClick={this.handleSelect.bind(this)}
              >
                Current
              </Button>
              <Button
                id="archived"
                style={{ margin: '0px' }}
                className="normalbtn"
                onClick={this.handleSelect.bind(this)}
              >
                Archived
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col xs={12} md={12} lg={12}>
            {Object.keys(notes).map(key => {
              var note = notes[key];
              if (!note.completed) {
                if (this.state.filter === 'current') {
                  return (
                    <FormGroup key={note.key}>
                      <InputGroup>
                        <InputGroup.Addon>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => {
                              dispatch(
                                actions.noteArchive(
                                  note.key,
                                  auth.email,
                                  user.name
                                )
                              );
                            }}
                          />
                        </InputGroup.Addon>
                        <FormControl
                          id="message"
                          componentClass="textarea"
                          style={{
                            height:
                              note.message.split(/\r\n|\r|\n/).length * 25,
                            minHeight: '50px'
                          }}
                          disabled
                          value={note.message}
                        />
                      </InputGroup>
                      <InputGroup.Addon>
                        {_.find(centres, { key: note.centreKey }).name}
                      </InputGroup.Addon>
                      <HelpBlock
                        style={{ textAlign: 'right', fontSize: '10px' }}
                      >
                        <i>
                          - by {note.name} on {note.date}{' '}
                          {note.email === auth.email
                            ? <button
                                className="btn"
                                onClick={e => {
                                  e.preventDefault();
                                  this.deleteNote(note.key);
                                }}
                              >
                                Delete
                              </button>
                            : null}
                        </i>
                      </HelpBlock>
                    </FormGroup>
                  );
                }
              } else {
                if (this.state.filter === 'archived') {
                  return (
                    <FormGroup key={note.key}>
                      <InputGroup>
                        <InputGroup.Addon>
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => {
                              dispatch(
                                actions.noteArchive(
                                  note.key,
                                  auth.email,
                                  user.name
                                )
                              );
                            }}
                          />
                        </InputGroup.Addon>
                        <FormControl
                          id="message"
                          componentClass="textarea"
                          style={{
                            height:
                              note.message.split(/\r\n|\r|\n/).length * 25,
                            minHeight: '50px'
                          }}
                          disabled
                          value={note.message}
                        />
                      </InputGroup>
                      <InputGroup.Addon>
                        {_.find(centres, { key: note.centreKey }).name}
                      </InputGroup.Addon>
                      <HelpBlock
                        style={{ textAlign: 'right', fontSize: '10px' }}
                      >
                        <i>
                          - by {note.name} on {note.date}{' '}
                          {note.email === auth.email
                            ? <button
                                className="btn"
                                onClick={e => {
                                  e.preventDefault();
                                  this.deleteNote(note.key);
                                }}
                              >
                                Delete
                              </button>
                            : null}
                        </i>
                      </HelpBlock>
                    </FormGroup>
                  );
                }
              }
            })}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(state => {
  return state;
})(NotesAll);
