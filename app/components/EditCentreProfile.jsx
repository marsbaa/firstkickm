import React from 'react'
import {Grid,Row,Panel,Col,FormControl,ControlLabel, FormGroup, Button, HelpBlock,Image, Modal} from 'react-bootstrap'
import {btn} from 'styles.css'
import {browserHistory} from 'react-router'
import TermList from 'TermList'
import DeleteTermModal from 'DeleteTermModal'
import {Link} from 'react-router'

var actions = require('actions');
var {connect} = require('react-redux');
var _ = require('lodash');

export var EditCentreProfile = React.createClass({
  getInitialState: function() {
    return {
      errorID: null,
      errorName: null,
      errorMessageID : '',
      errorMessageName: '',
      logoURL: '',
      showModal: false,
      deleteTerm: ''
    };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({showModal: true});
  },

  delete(key) {
    this.setState({deleteTerm: key});
  },


  handleChange(e) {
    e.preventDefault();
    this.setState({
      logoURL: e.target.value
    });
  },


  formSubmit(e) {
    e.preventDefault();
    var {dispatch, centres} = this.props;
    var centreID = document.getElementById('centreID').value;
    var centreName = document.getElementById('centreName').value;
    var logoURL = document.getElementById('logoURL').value;
    var count = 0;
    if (centreID === '') {
      this.setState({
        errorID: 'error',
        errorMessageID: 'Field Empty. Please enter Centre ID'
      });
      count += 1;
    }
    else {
      this.setState({
        errorID: null,
        errorMessageID : ''
      })
    }
    if (centreName === '') {
      this.setState({
        errorName: 'error',
        errorMessageName: 'Field Empty. Please enter Centre Name'
      });
      count += 1;
    }
    else {
      this.setState({
        errorName: null,
        errorMessageName : ''
      })
    }

    var currentCentreID = this.props.params.centreID;
    if (currentCentreID === '0'){
      var centreExist = _.findIndex(centres, (c) => {return c.id === centreID});
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
        var selectedCentre = _.find(centres, {id: centreID});
        var centre = {
          key: selectedCentre.key,
          id: centreID,
          name: centreName,
          logoURL: logoURL,
          calendars: selectedCentre.calendars
        };
        dispatch(actions.updateCentre(centre));
        browserHistory.push('/m/centres');
    }

  },


  componentDidMount() {
    var {dispatch} = this.props;
    var centreID = this.props.params.centreID;
    this.setState({
      logoURL: document.getElementById('logoURL').value
    });
    if (centreID === '0') {
      dispatch(actions.updateNavTitle("/m/centres", "Add Centre"));
    }
    else {
      dispatch(actions.updateNavTitle("/m/centres", "Edit Centre"));
    }

  },

  render: function () {
    var centreID = this.props.params.centreID;
    var centre = {key:'', id: '', name: '', logoURL: '', calendars: []};
    var {centres} = this.props;
    if (centreID != '0') {
      centres.map((c) => {
        if(c.id === centreID) {
          centre = c;
        }
      });
    }
    else {
      centre = {id: '', name: '', logoURL: '', calendars: []};
    }

   return (
     <div>
       <Grid>
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
              defaultValue={centre.logoURL} onChange={this.handleChange}/>
            <Image src={this.state.logoURL} responsive/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Class Day & Time</ControlLabel>
              <button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}} >Add Class</button>
            </FormGroup>
          </Col>
           <Col md={6}>
             <ControlLabel>Term Dates</ControlLabel>
               <Link to={"/m/centres/"+centreID+
                 "/add"} activeClassName="active"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05'}}>Add Term</button>
               </Link>
             <div>
              <DeleteTermModal showModal={this.state.showModal} closeModal={this.close} centreKey={centre.key} calendarKey={this.state.deleteTerm} />
              <TermList centreId={centreID} openModal={this.open} handleDeleteKey={this.delete}/>
             </div>
             <button className="btn" style={{width: '100%', margin: '25px 0px'}} onClick={this.formSubmit}>Save Centre Profile</button>
           </Col>
         </Row>
       </Grid>
     </div>

   );
 }
 });

 export default connect((state) => {return state;
})(EditCentreProfile);
