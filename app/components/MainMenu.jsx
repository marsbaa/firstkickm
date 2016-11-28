var React = require('react')
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import mainbtn from 'styles.css'
var {connect} = require('react-redux')
var {Link, IndexLink} = require('react-router')
var actions = require('actions');

export var MainMenu = React.createClass({


  handleSelect(e) {
    e.preventDefault();
    if (e.target.value === '0') {
      document.getElementById("trials").disabled = true;
      document.getElementById("student").disabled = true;
      document.getElementById("coach").disabled = true;
    }
    else {
      document.getElementById("trials").disabled = false;
      document.getElementById("student").disabled = false;
      document.getElementById("coach").disabled = false;
    }
  },

    componentDidMount() {
      var {dispatch} = this.props;
      dispatch(actions.updateNavTitle("/m", "Dashboard"));
    },

    render: function() {
        return (
          <Grid style={{paddingTop:'20px', overflow: 'hidden'}}>
            <Row>
              <Col xs={12} md={12}>
                  <FormGroup controlId="formControlsSelect" style={{textAlign: 'center', margin: '3px 5px', width: '100%'}}>
                    <ControlLabel>Select Centre</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onChange={this.handleSelect}>
                      <option value="0">select</option>
                      <option value="1">Bishan</option>
                      <option value="2">Jurong</option>
                      <option value="3">Kovan</option>
                      <option value="4">Punggol</option>
                    </FormControl>
                  </FormGroup>
                <Link to="" activeClassName="active"><button className="mainbtn" id="trials" disabled>Trials</button></Link>
                <Link to="" activeClassName="active"><button className="mainbtn" id="student" disabled>Student Attendance</button></Link>
                <Link to="" activeClassName="active"><button className="mainbtn" id="coach" disabled>Coach Attendance</button></Link>
                <Link to="m/cp" activeClassName="active"><button className="mainbtn">Centres Profile</button></Link>
              </Col>
            </Row>
          </Grid>
        );
    }
});

export default connect()(MainMenu);
