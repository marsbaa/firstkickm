import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'
var {connect} = require('react-redux')
var actions = require('actions')
import {Panel, Grid, Row, Col, FormControl, FormGroup, ControlLabel, Radio, Checkbox,Button, Modal} from 'react-bootstrap'

class TrialRegisterChildForm extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedCentre : '',
      trialDate : '',
      notJoining: false,
      showModal: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)

  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleChange(e){
    var {dispatch} = this.props
    var {id} = this.props.trial
    this.setState({
      notJoining: this.state.notJoining===true? false:true
    })
    dispatch(actions.updateJoining(id))
  }

  centreSelect(e) {
    e.preventDefault();
    this.setState({
      selectedCentre: e.target.value
    });
  }

  trialDateSelect(e) {
    e.preventDefault();
    this.setState({
      trialDate : e.target.value
    });
  }

  componentWillMount() {
    var trial = this.props.trial;
    this.setState({selectedCentre: trial.venueId});
    this.setState({trialDate: trial.dateOfTrial});
  }

  onFormSubmit(e) {
    e.preventDefault();
    var {dispatch} = this.props;
    var {id} = this.props.trial;
    var classTimeSelector = document.getElementById('timeSlotSelect'+id);
    var classTimeDay = classTimeSelector.options[classTimeSelector.selectedIndex].text;
    var init = classTimeDay.indexOf('(')
    var fin = classTimeDay.indexOf(')')
    var classDay = classTimeDay.substr(init+1, fin-init-1)
    var trial = {
      id: id,
      childName: document.getElementById("childName"+id).value,
      gender: document.getElementById("boy"+id).checked ? "boy" : "girl",
      dateOfBirth: document.getElementById("dateOfBirth"+id).value,
      dateOfTrial: document.getElementById("trialDateSelect"+id).value,
      venueId: document.getElementById("centreSelect"+id).value.toString(),
      currentClassTime: document.getElementById('timeSlotSelect'+id).value,
      currentClassDay: classDay,
      medicalCondition: document.getElementById("medicalCondition"+id).value
    };
    dispatch(actions.updateRegister(trial));
    this.open();

  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

  render() {
    var {centres, ageGroup, calendars} = this.props;
    var trial = this.props.trial

    var getAge = (dob) => {
    var now = moment();
    var dateofbirth = moment(JSON.stringify(dob), "YYYY-MM-DD");
    return now.diff(dateofbirth, 'years');
  };
    var childAgeGroup;
    ageGroup.map((group) => {
      var age = getAge(trial.dateOfBirth);
      if (age >= group.minAge && age <= group.maxAge) {
        childAgeGroup = group.name;
      }
    });

    //Centre List
    var centreOptions = [];
    centreOptions.push(<option key="0" value="0">select</option>);
    centres.map((centre) => {
      centreOptions.push(<option key={centre.id} value={centre.id}>{_.upperFirst(centre.name)}</option>);
    });

    //Class TimeSlots
    var classTimeSlots = [];
    classTimeSlots.push(<option key="0" value="0">select</option>);
    var centre = {};
    centres.map((c) => {
      if(c.id === this.state.selectedCentre.toString()) {
        centre = c;
      }
    });

    Object.keys(centre.classes).forEach((classID) => {
      var cla = centre.classes[classID];
      if (cla.ageGroup === childAgeGroup) {
        var classTime = cla.startTime + " - " + cla.endTime;
        var classTimeDay = classTime+ " ("+cla.day+")";
        classTimeSlots.push(<option key={classTimeDay} value={classTime}>{classTimeDay}</option>);
      }

    });

    //Trial dates
    var trialDateOptions = [];
    trialDateOptions.push(<option key="0" value="0">select</option>);
    Object.keys(calendars).map((calendarKey) => {
      var calendar = calendars[calendarKey]
      if (centre.key === calendar.centreKey) {
        Object.keys(calendar.terms).map((termId) => {
          var term = calendar.terms[termId]
          term.map((dates) => {
            var formattedDate = moment(dates).format("YYYY-MM-DD");
            trialDateOptions.push(<option key={formattedDate} value={formattedDate}>{formattedDate}</option>);
          })
        })
      }
    })

    var formHTML = []
    if (!this.state.notJoining) {
      formHTML.push(
        <Grid key={trial.id}>
          <Row style={{padding: '10px'}}>
          <Col xs={12} md={10} lg={11}>
            <FormGroup>
              <ControlLabel>Child's Name</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id={"childName"+trial.id}
              type="text"
              placeholder="Enter Child's Name"
              defaultValue={trial.childName}/>
            </FormGroup>
            <FormGroup>
              <Radio id={'boy'+trial.id} value="boy" inline name={'gender' + trial.id} defaultChecked={trial.gender==="boy" ? true: false}>
                Boy
              </Radio>
              {' '}
              <Radio id={'girl'+trial.id} value="girl" inline name={'gender' + trial.id} defaultChecked={trial.gender==="girl" ? true: false}>
                Girl
              </Radio>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Date of Birth</ControlLabel>
              <FormControl style={{marginBottom: '10px'}}
              id={"dateOfBirth"+trial.id}
              type="text"
              placeholder="Enter Date of Birth"
              defaultValue={trial.dateOfBirth}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Centre</ControlLabel>
              <FormControl
                id={"centreSelect"+trial.id} componentClass="select" placeholder="select"
                defaultValue={trial.venueId}
                onChange={this.centreSelect.bind(this)}>
                {centreOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Selected Class Time</ControlLabel>
              <FormControl
                id={"timeSlotSelect"+trial.id} componentClass="select" placeholder="select"
                defaultValue={trial.timeOfTrial}>
                {classTimeSlots}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Date of Trial</ControlLabel>
              <FormControl
                id={"trialDateSelect"+trial.id} componentClass="select" placeholder="select"
                defaultValue={trial.dateOfTrial}
                onChange={this.trialDateSelect.bind(this)}>
                {trialDateOptions}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Medical Condition</ControlLabel>
              <FormControl style={{marginBottom: '10px', height: '90px'}}
              id={"medicalCondition"+trial.id}
              componentClass="textarea"
              placeholder="Enter Medical Condition"
              defaultValue={trial.medicalCondition}/>
            </FormGroup>
            </Col>
        </Row>

          <Row style={{padding: '0px 10px', marginBottom: '30px'}}>
            <Col xs={12} md={10} lg={11}>
              <button className='submitbtn' onClick={this.onFormSubmit.bind(this)}>Update Child's Details</button>
            </Col>
          </Row>
        </Grid>

        )
    }
    else {
      formHTML.push(<Row key={trial.id}>
        <Col md={12}>
          {trial.childName} is not joining
        </Col>
      </Row>)
    }


    return (
      <Panel header={
          <Row>
            <Col xs={7} md={7}>
              <ControlLabel>
                Child's Details
              </ControlLabel>
            </Col>
            <Col xs={5} md={5} style={{textAlign: 'right'}}>
              <Checkbox name="checkJoining" onChange={this.handleChange} checked={this.state.notJoining} style={{margin: '0px'}}>Not Joining</Checkbox>
            </Col>
          </Row>
        }>
        <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          Done
        </Modal.Header>
        <Modal.Body>
          Child Details Updated
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
        {formHTML}
      </Panel>

    );
  }
}

export default connect(
  (state) => {
    return state;
  }
)(TrialRegisterChildForm);
