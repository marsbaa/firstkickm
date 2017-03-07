var React = require('react')
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import mainbtn from 'styles.css'
var {connect} = require('react-redux')
var {Link, IndexLink} = require('react-router')
var actions = require('actions');

class MainMenu extends React.Component {


  handleSelect(e) {
    var {dispatch} = this.props;
    e.preventDefault();
    if (e.target.value === '0') {
      document.getElementById("trials").disabled = true;
      document.getElementById("student").disabled = true;
      document.getElementById("coach").disabled = true;
      document.getElementById("coachSchedule").disabled = true;
      document.getElementById("attendance").disabled = true;
    }
    else {
      document.getElementById("trials").disabled = false;
      document.getElementById("student").disabled = false;
      document.getElementById("coach").disabled = false;
      document.getElementById("coachSchedule").disabled = false;
      document.getElementById("attendance").disabled = false;
      dispatch(actions.updateSelectedCentre(e.target.value));
    }
  }

    componentDidMount() {
      var {dispatch, selection} = this.props;
      dispatch(actions.updateNavTitle("/m", "Dashboard"));
      if (selection != "0") {
        document.getElementById("trials").disabled = false;
        document.getElementById("student").disabled = false;
        document.getElementById("attendance").disabled = false;
        document.getElementById("coach").disabled = false;
        document.getElementById("coachSchedule").disabled = false;
      }
    }

    render() {
        var {selection, centres} = this.props;
        var trialsLink = "/m/trials/";

        //Centre List
        var centreOptions = [];
        centreOptions.push(<option key="0" value="0">select</option>);
        centres.map((centre) => {
          centreOptions.push(<option key={centre.id} value={centre.id}>{_.upperFirst(centre.name)}</option>);
        });


        return (
          <Grid style={{paddingTop:'20px', overflow: 'hidden'}}>
            <Row>
              <Col xs={12} md={12}>
                  <FormGroup style={{textAlign: 'center', margin: '3px 5px', width: '100%'}}>
                    <ControlLabel>Select Centre</ControlLabel>
                    <FormControl
                      id="centreSelect" componentClass="select" placeholder="select" onChange={this.handleSelect.bind(this)}
                      defaultValue={selection}>
                      {centreOptions}
                    </FormControl>
                  </FormGroup>
                <Link to={trialsLink} activeClassName="active"><button className="mainbtn" id="trials" disabled>Trials</button></Link>
                <Link to="m/attendance" activeClassName="active"><button className="mainbtn" id="attendance" disabled>Student Attendance</button></Link>
                <Link to="m/students" activeClassName="active"><button className="mainbtn" id="student" disabled>Students Profile</button></Link>
                <Link to="" activeClassName="active"><button className="mainbtn" id="coach" disabled>Coach Attendance</button></Link>
                <Link to="m/coachschedule" activeClassName="active"><button className="mainbtn" id="coachSchedule"
                disabled>Coach Scheduling</button></Link>
                <Link to="m/coaches" activeClassName="active"><button className="mainbtn">Coaches Profile</button></Link>
                <Link to="m/centres" activeClassName="active"><button className="mainbtn">Centres Profile</button></Link>
                <Link to="m/settings" activeClassName="active"><button className="mainbtn">Settings</button></Link>
              </Col>
            </Row>
          </Grid>
        );
    }
}

export default connect((state) => {return state;
})(MainMenu);
