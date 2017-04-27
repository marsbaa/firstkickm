import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Checkbox, Glyphicon, Modal, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'
import {boy, girl, innerbtn} from 'styles.css'
import moment from 'moment'
var actions = require('actions')
import {Link} from 'react-router'
import Switch from 'Switch'

class Trial extends React.Component{
  constructor(props){
    super(props);
    this.state= {
      show: false
    }
  }

  handleSelect() {
    this.setState({show: true})
  }


  formSubmit(){
    var {dispatch, id} = this.props
    dispatch(actions.addDeposit(document.getElementById('amount').value, id))
    this.setState({show: false})
  }

  render () {
    var {id, childName, dateOfBirth, contact, email, gender, dispatch, attended, attendedOn, registered, dateRegistered, deposit} = this.props;
    var trialClassName = attended ? 'trialCompleted' : 'trial';
    var truncatedChildName = _.truncate(childName, {
  'length': 18});

    var getAge = (dob) => {
    var now = moment();
    var dateofbirth = moment(JSON.stringify(dob), "YYYY-MM-DD");
    return now.diff(dateofbirth, 'years');
  };
    var registeredHTML = []
    if (registered) {
      registeredHTML.push(
        <Row key={id} style={{backgroundColor: '#d7d7d7', padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={2} md={2}>
            <Switch name={id+"attended"} checked={attended.toString()} defaultChecked={attended} onChange={()=> {
                dispatch(actions.startToggleTrial(id));
              }} />
          </Col>
          <Col xs={6} md={6} >
            <div>
                  <font className={trialClassName}>{truncatedChildName} </font><font className={gender}>({getAge(dateOfBirth)})</font>
            </div>
            <div style={{fontSize: '10px', color: '#9a9a9a'}}>
              <Glyphicon style={{color: '#656565'}} glyph="envelope" /> {email.toLowerCase()}
            </div>
            <div style={{fontSize: '10px', color: '#9a9a9a'}}><Glyphicon style={{color: '#656565'}} glyph="phone" /> {contact}
            </div>
          </Col>
          <Col xs={4} md={4} style={{textAlign:'right'}}>
            Registered on {moment(dateRegistered).format('D MMM YYYY')}
          </Col>
        </Row>
        )
    }
    else {
      registeredHTML.push(
        <Row key={id} style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={2} md={2}>
            <Switch name={id+"attended"} checked={attended.toString()} defaultChecked={attended} onChange={()=> {
                dispatch(actions.startToggleTrial(id));
              }} />
          </Col>
          <Col xs={5} md={5} style={{paddingRight: '3px'}} >
            <div>
                  <font className={trialClassName}>{truncatedChildName} </font><font className={gender}>({getAge(dateOfBirth)})</font>
            </div>
            <div style={{fontSize: '10px', color: '#9a9a9a'}}>
              <Glyphicon style={{color: '#656565'}} glyph="envelope" /> {email.toLowerCase()}
            </div>
            <div style={{fontSize: '10px', color: '#9a9a9a'}}><Glyphicon style={{color: '#656565'}} glyph="phone" /> {contact}
            </div>
          </Col>
          <Col xs={5} md={5} style={{textAlign:'right', paddingRight:'3px', paddingLeft: '3px'}}>
            <button className="innerbtn" onClick={this.handleSelect.bind(this)}>D{deposit === undefined ? "": ": $"+deposit}</button>
            <Link to={"/m/trials/edit/"+id}><button className="innerbtn"><Glyphicon glyph="pencil" /> </button></Link>
            <Link  to={"/m/trials/register/"+id}><button className="innerbtn" >Register</button></Link>
          </Col>
        </Row>
        )
    }
  let close = () => this.setState({show:false})

  return (
    <div>
      <Modal
         show={this.state.show}
         onHide={close}
         container={this}
         aria-labelledby="contained-modal-title"
       >
         <Modal.Header closeButton>
           <Modal.Title id="contained-modal-title">Place Deposit for<br/><font style={{fontSize: '14px', color: '#f5bb05'}}>{childName}</font></Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <FormGroup>
             <ControlLabel>Amount</ControlLabel>
               <FormControl style={{marginBottom: '10px'}}
               id="amount"
               type="text"
               placeholder="Enter Amount"/>
           </FormGroup>
         </Modal.Body>
         <Modal.Footer>
           <Button bsSize='large' onClick={this.formSubmit.bind(this)}>Yes</Button>
           <Button bsSize='large' onClick={close}>No</Button>
         </Modal.Footer>
      </Modal>
      {registeredHTML}
    </div>
  );
}
}


export default connect((state) => {return state;
})(Trial);
