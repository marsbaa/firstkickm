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
    jerseyPending.map((student, id) => {
      html.push(<Jersey key={student.childKey} student={student} paymentKey={id} />)
    })

   return (
     <div>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={12} md={12}>
           <Search type="student" />
         </Col>
       </Row>
      {html}
    </div>
   );
  }
 }


 export default connect((state) => {return state;
})(JerseyIssueList);
