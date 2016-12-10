var React = require('react')
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import mainbtn from 'styles.css'
var {connect} = require('react-redux')
var {Link, IndexLink} = require('react-router')
var actions = require('actions');

export var MainMenu = React.createClass({


  handleSelect(e) {
    var {dispatch} = this.props;
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
      dispatch(actions.updateSelectedCentre(e.target.value));
    }
  },

    componentDidMount() {
      var {dispatch, selection} = this.props;
      dispatch(actions.updateNavTitle("/m", "Dashboard"));
      if (selection != "0") {
        document.getElementById("trials").disabled = false;
        document.getElementById("student").disabled = false;
        document.getElementById("coach").disabled = false;
      }
    },

    render: function() {
        var {selection} = this.props;
        var trialsLink = "/m/trials/" + selection;

        return (
          <Grid style={{paddingTop:'20px', overflow: 'hidden'}}>
            <Row>
              <Col xs={12} md={12}>
                  <FormGroup style={{textAlign: 'center', margin: '3px 5px', width: '100%'}}>
                    <ControlLabel>Select Centre</ControlLabel>
                    <FormControl
                      id="centreSelect" componentClass="select" placeholder="select" onChange={this.handleSelect}
                      defaultValue={selection}>
                      <option value="0">select</option>
                      <option value="1">Bishan</option>
                      <option value="2">Jurong</option>
                      <option value="3">Kovan</option>
                      <option value="4">Punggol</option>
                      <option value="5">Thomson</option>
                      <option value="6">Tampines</option>
                      <option value="7">Yishun</option>
                    </FormControl>
                  </FormGroup>
                <Link to={trialsLink}activeClassName="active"><button className="mainbtn" id="trials" disabled>Trials</button></Link>
                <Link to="" activeClassName="active"><button className="mainbtn" id="student" disabled>Student Attendance</button></Link>
                <Link to="" activeClassName="active"><button className="mainbtn" id="coach" disabled>Coach Attendance</button></Link>
                <Link to="m/coaches" activeClassName="active"><button className="mainbtn">Coaches Profile</button></Link>
                <Link to="m/centres" activeClassName="active"><button className="mainbtn">Centres Profile</button></Link>
              </Col>
            </Row>
          </Grid>
        );
    }
});

export default connect((state) => {return state;
})(MainMenu);
