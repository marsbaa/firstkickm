import React from 'react';
import {Link} from 'react-router'
import {Row, Col, Modal, FormGroup, HelpBlock, ControlLabel, FormControl, Button} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import AgeGroup from 'AgeGroup'
var actions = require('actions');

class SettingsList extends React.Component{

  renderAgeGroup() {
    var {ageGroup} = this.props;
    var html = []
    if (!(_.isEmpty(ageGroup))) {
    ageGroup.map((ageG) => {
      html.push(<AgeGroup key={ageG.name} a={ageG} />);
    });
    }
    return html;

  }

  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/settings", "Settings"));
  }

  render() {

   return (
     <div>
       <Row style={{padding: '5px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center', backgroundColor:'#fff'}}>
         <Col xs={8} md={8} style={{paddingLeft:'35px'}}>
           <h5>Age Groups</h5>
         </Col>
         <Col xs={4} md={4}>
         <Link to="/m/settings/ageGroup/add"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05'}}>Add Age Group</button></Link>
         </Col>
       </Row>
       {this.renderAgeGroup()}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(SettingsList);
