import React from 'react'
import {Grid,Row,Panel,Col, Form, FormControl,ControlLabel, FormGroup, Button, HelpBlock,Image, Modal} from 'react-bootstrap'
import {btn} from 'styles.css'
import CalendarList from 'CalendarList'
import ClassList from 'ClassList'
import DeleteModal from 'DeleteModal'
import {Link, browserHistory} from 'react-router'

var actions = require('actions');
var {connect} = require('react-redux');
var _ = require('lodash');

class CentreEdit extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      errorID: null,
      errorName: null,
      errorMessageID : '',
      errorMessageName: '',
      logoURL: '',
      showModal: false,
      delete: '',
      type: '',
      classRow: 0
    }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this.delete = this.delete.bind(this)
    this.type = this.type.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({showModal: true});
  }

  delete(key) {
    this.setState({delete: key});
  }

  type(type) {
    this.setState({type: type});
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      logoURL: e.target.value
    });
  }

  formSubmit(e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var centre = centres[this.props.params.centreKey]
    var centreID = document.getElementById('centreID').value;
    var centreName = document.getElementById('centreName').value;
    var logoURL = document.getElementById('logoURL').value;
    var count = 0;
    if (_.size(centreID) == 0) {
      count += 1;
      this.setState({
        errorID: 'error',
        errorMessageID: 'Field Empty. Please enter Centre ID'
      });

    }
    else {
      this.setState({
        errorID: null,
        errorMessageID : ''
      })
    }
    if (_.size(centreName) == 0) {
      count += 1;
      this.setState({
        errorName: 'error',
        errorMessageName: 'Field Empty. Please enter Centre Name'
      });

    }
    else {
      this.setState({
        errorName: null,
        errorMessageName : ''
      })
    }

    if (centre.key === '0'){
      var centreExist = _.findIndex(centres, {id: centreID})
      if (centreExist === -1) {
        this.setState({
          errorID: null,
          errorMessageID: ''
        });
      var centre = {
        id: centreID,
        name: centreName,
        logoURL: logoURL
      };
      dispatch(actions.addCentre(centre));
      browserHistory.push('/m/centres');
      }
      else {
        this.setState({
          errorID: 'error',
          errorMessageID : 'Centre ID exist. Please choose another Centre ID.'
        });
      }
    }

    else if (count === 0) {
        var selectedCentre = {
          key: centre.key,
          id: centreID,
          name: centreName,
          logoURL: logoURL,
          classes: centre.classes
        };
        dispatch(actions.updateCentre(centre));
        browserHistory.push('/m/centres');
    }

  }


  componentDidMount() {
    var {dispatch} = this.props;
    var centreID = this.props.params.centreID;
    var {centres} = this.props;
    this.setState({
      logoURL: document.getElementById('logoURL').value
    });
    if (centreID === '0') {
      dispatch(actions.updateNavTitle("/m/centres", "Add Centre"));
    }
    else {
      dispatch(actions.updateNavTitle("/m/centres", "Edit Centre"));
    }


  }

  render() {
    var {centres} = this.props;
    var centreKey = this.props.params.centreKey;
    var centre = {key:'', id: '', name: '', logoURL: ''};
    if (centreKey != '0') {
      centre = centres[centreKey]
    }
    else {
      centre = {id: '', name: '', logoURL: ''};
    }

   return (
     <div>
       <Grid style={{marginTop: '20px'}}>
         <Row>
           <Col md={6}>
            <FormGroup validationState={this.state.errorID}>
              <ControlLabel>Centre ID</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="centreID"
              type="text"
              placeholder="Enter Centre ID"
              disabled={centre.id === '' ? false : true}
              defaultValue={centre.id}/>
            <HelpBlock>{this.state.errorMessageID}</HelpBlock>
            </FormGroup>
            <FormGroup validationState={this.state.errorName}>
              <ControlLabel>Centre Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="centreName"
              type="text"
              placeholder="Enter Centre Name"
              defaultValue={centre.name}/>
            <HelpBlock>{this.state.errorMessageName}</HelpBlock>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Logo URL</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id="logoURL"
              type="text"
              placeholder="Enter Logo URL"
              defaultValue={centre.logoURL} onChange={this.handleChange.bind(this)}/>
            <Image src={this.state.logoURL} responsive/>
            </FormGroup>
          </Col>
           <Col md={6}>
             <FormGroup>
               <ControlLabel>Class Day & Time</ControlLabel>
               <Link to={"/m/centres/"+centreKey+"/class/add"}>
                 <button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}} >Add Class</button></Link>
             </FormGroup>
             <div style={{marginBottom: '20px'}}>
               <ClassList centreKey={centreKey} openModal={this.open} handleDeleteKey={this.delete} handleDeleteType={this.type} />
             </div>
             <ControlLabel>Term Dates</ControlLabel>
               <Link to={"/m/centres/"+centreKey+
                 "/add"} activeClassName="active"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05'}}>Add Calendar</button>
               </Link>
             <div>
              <DeleteModal showModal={this.state.showModal} closeModal={this.close} centreKey={centre.key} deleteKey={this.state.delete} type={this.state.type}/>
              <CalendarList centreKey={centre.key} openModal={this.open} handleDeleteKey={this.delete} handleDeleteType={this.type}/>
             </div>
             <button className="submitbtn" style={{width: '100%', margin: '25px 0px'}} onClick={this.formSubmit}>Save Centre Profile</button>
           </Col>
         </Row>
       </Grid>
     </div>

   );
 }
 }

 export default connect((state) => {return state;
})(CentreEdit);
