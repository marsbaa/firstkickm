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
    dispatch(actions.updateSelectedCentre(e.target.value));
  }

    componentDidMount() {
      var {dispatch, selection} = this.props;
      dispatch(actions.updateNavTitle("/m", "Dashboard"));

    }

    render() {
        var {selection, centres, users, auth} = this.props;
        var user;
        if (auth.email === 'ray@marsbaa.com') {
          user = {
            name: 'Ray Yee',
            email: 'ray@marsbaa.com',
            assignedRoles : 'Manager',
            assignedCentres : { 0 : 'all'}
          }
        }
        else {
          user = _.find(users, ['email', auth.email])
        }
        //Centre List
        var centreOptions = [];
        centreOptions.push(<option key="0" value="0">select</option>);
        if (user !== undefined) {
          centres.map((centre) => {
            var index = _.findIndex(user.assignedCentres, (c) => { return c == centre.id })
            if (index !== -1 || user.assignedCentres[0] === 'all') {
              centreOptions.push(<option key={centre.id} value={centre.id}>{_.upperFirst(centre.name)}</option>);
            }
          });
          var menuHTML = []
          if (user.assignedRoles === 'Administrator') {
            menuHTML.push(<div key="adminmenu">
            <Link to="m/trials" ><button className="mainbtn" id="trials" disabled={selection === '0' ? true : false}>Trials</button></Link>
            <Link to="m/attendance" ><button className="mainbtn" id="attendance" disabled={selection === '0' ? true : false}>Student Attendance</button></Link>
            <Link to="m/payment" ><button className="mainbtn" id="makePayment" disabled={selection === '0' ? true : false}>Make Payment</button></Link>
            <Link to="m/total" ><button className="mainbtn" id="totalCollection" disabled={selection === '0' ? true : false}>Total Collection (Today)</button></Link>
            <Link to="m/coachattendance" ><button className="mainbtn" id="coach" disabled={selection === '0' ? true : false}>Coach Attendance</button></Link>
            </div>)
          }
          else if(user.assignedRoles === 'Head Coach') {
              menuHTML.push(
                <div key="headcoachmenu">
                  <Link to="m/coachattendance" ><button className="mainbtn" id="coach" disabled={selection === '0' ? true : false}>Coach Attendance</button></Link>
                <Link to="m/coachschedule" ><button className="mainbtn" id="coachSchedule"
                  disabled={selection === '0' ? true : false}>Coach Scheduling</button></Link>
                </div>

            )
          }
          else if (user.assignedRoles === 'Manager') {
            menuHTML.push(
              <div key="managermenu">
                <Link to="m/trials" ><button className="mainbtn" id="trials" disabled={selection === '0' ? true : false}>Trials</button></Link>
                <Link to="m/attendance" ><button className="mainbtn" id="attendance" disabled={selection === '0' ? true : false}>Student Attendance</button></Link>
                <Link to="m/payment" ><button className="mainbtn" id="makePayment" disabled={selection === '0' ? true : false}>Make Payment</button></Link>
                <Link to="m/total" ><button className="mainbtn" id="totalCollection" disabled={selection === '0' ? true : false}>Total Collection (Today)</button></Link>
                <Link to="m/coachattendance" ><button className="mainbtn" id="coach" disabled={selection === '0' ? true : false}>Coach Attendance</button></Link>
                  <Link to="m/coachschedule" ><button className="mainbtn" id="coachSchedule"
                    disabled={selection === '0' ? true : false}>Coach Scheduling</button></Link>
                  <Link to="m/students" ><button className="mainbtn" id="student" disabled={selection === '0' ? true : false}>Students Profile</button></Link>
                <Link to="m/coaches" ><button className="mainbtn">Coaches Profile</button></Link>
              </div>

            )
          }
        }





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
                {menuHTML}

              </Col>
            </Row>
          </Grid>
        );
    }
}

export default connect((state) => {return state;
})(MainMenu);
