import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
var actions = require('actions');
import Search from 'Search'
import _ from 'lodash'
import Jersey from 'Jersey'

class JerseyIssueList extends React.Component{

  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/jersey", "Jersey Issue"));
  }

  render() {
    var {payments} = this.props;
    var html = []
    var jerseyPending = _.filter(payments, {jerseyIssued: false});
    jerseyPending.map((student) => {
      html.push(<Jersey key={student.childKey} student={student} paymentKey={student.key} />)
    })

   return (
     <div>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={8} md={8}>
           <Search type="student" />
         </Col>
         <Col xs={4} md={4}>
         <Link to="/m/jersey/issued"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}}>History</button></Link>
         </Col>
       </Row>
      {html}
    </div>
   );
  }
 }


 export default connect((state) => {return state;
})(JerseyIssueList);
