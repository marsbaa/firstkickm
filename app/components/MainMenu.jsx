var React = require('react')
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import mainbtn from 'styles.css'
var {connect} = require('react-redux')
var {Link, IndexLink} = require('react-router')
var actions = require('actions');

class MainMenu extends React.Component {


  handleSelect(e) {
    var {dispatch, centres} = this.props;
    e.preventDefault();
    var centre;
    centres.map((c)=> {
      if (e.target.value === c.id) {
        centre = c
      }
    })
    dispatch(actions.updateSelectedCentre(centre));
  }

    componentDidMount() {
      var {dispatch} = this.props;
      dispatch(actions.updateNavTitle("/m", "Dashboard"));
      //dispatch(actions.deleteDuplicateStudent())
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
            <Link to="m/trials" ><button className="mainbtn" id="trials" disabled={selection.id === '0' ? true : false}>Trials</button></Link>
            <Link to="m/attendance" ><button className="mainbtn" id="attendance" disabled={selection.id === '0' ? true : false}>Student Attendance</button></Link>
            <Link to="m/payment" ><button className="mainbtn" id="makePayment" disabled={selection.id === '0' ? true : false}>Payment</button></Link>
            <Link to="m/jersey" ><button className="mainbtn" id="jersey" disabled={selection.id === '0' ? true : false}>Jersey Issue</button></Link>
            <Link to="m/total" ><button className="mainbtn" id="totalCollection" disabled={selection.id === '0' ? true : false}>Total Collection (Today)</button></Link>
            <Link to="m/coachattendance" ><button className="mainbtn" id="coach" disabled={selection.id === '0' ? true : false}>Coach Attendance</button></Link>
            <Link to="m/notes" ><button className="mainbtn" id="notes" disabled={selection.id === '0' ? true : false}>Notes to HQ</button></Link>
            <Link to="m/students" ><button className="mainbtn" id="student" disabled={selection.id === '0' ? true : false}>Students Profile</button></Link>
            <Link to="m/makeup" ><button className="mainbtn" id="makeUp" disabled={selection.id === '0' ? true : false}>Make Up List</button></Link>
            </div>)
          }
          else if(user.assignedRoles === 'Head Coach') {
              menuHTML.push(
                <div key="headcoachmenu">
                  <Link to="m/coachattendance" ><button className="mainbtn" id="coach" disabled={selection.id === '0' ? true : false}>Coach Attendance</button></Link>
                <Link to="m/coachschedule" ><button className="mainbtn" id="coachSchedule"
                  disabled={selection.id === '0' ? true : false}>Coach Scheduling</button></Link>
                </div>

            )
          }
          else if (user.assignedRoles === 'Manager') {
            menuHTML.push(
              <div key="managermenu">
                <Link to="m/trials" ><button className="mainbtn" id="trials" disabled={selection.id === '0' ? true : false}>Trials</button></Link>
                <Link to="m/jersey" ><button className="mainbtn" id="jersey" disabled={selection.id === '0' ? true : false}>Jersey Issue</button></Link>
                <Link to="m/attendance/HQ" ><button className="mainbtn" id="attendanceHQ" disabled={selection.id === '0' ? true : false}>Student Attendance (HQ)</button></Link>
                
                <Link to="m/makeup" ><button className="mainbtn" id="makeUp" disabled={selection.id === '0' ? true : false}>Make Up List</button></Link>
                <Link to="m/payment" ><button className="mainbtn" id="makePayment" disabled={selection.id === '0' ? true : false}>Payment</button></Link>
                <Link to="m/payment/report" ><button className="mainbtn" id="paymentReport" disabled={selection.id === '0' ? true : false}>Payment Report (HQ)</button></Link>
                <Link to="m/total" ><button className="mainbtn" id="totalCollection" disabled={selection.id === '0' ? true : false}>Total Collection (Today)</button></Link>
                <Link to="m/totalhq" ><button className="mainbtn" id="totalCollectionHQ" disabled={selection.id === '0' ? true : false}>Total Collection (HQ)</button></Link>
                <Link to="m/coachattendance" ><button className="mainbtn" id="coach" disabled={selection.id === '0' ? true : false}>Coach Attendance</button></Link>
                <Link to="m/coachattendancehq" ><button className="mainbtn" id="coach" disabled={selection.id === '0' ? true : false}>Coach Attendance (HQ)</button></Link>
                  <Link to="m/coachschedule" ><button className="mainbtn" id="coachSchedule"
                    disabled={selection.id === '0' ? true : false}>Coach Scheduling</button></Link>
                  <Link to="m/notes" ><button className="mainbtn" id="notes" disabled={selection.id === '0' ? true : false}>Notes to HQ</button></Link>
                  <Link to="m/notes/all" ><button className="mainbtn" id="notesall">Notes Inbox</button></Link>
                  <Link to="m/charts" ><button className="mainbtn" id="charts" disabled={selection.id === '0' ? true : false}>Charts</button></Link>
                  <Link to="m/students" ><button className="mainbtn" id="student" disabled={selection.id === '0' ? true : false}>Students Profile</button></Link>
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
                      defaultValue={selection.id}>
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
