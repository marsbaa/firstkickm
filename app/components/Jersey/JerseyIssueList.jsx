import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {updateNavTitle} from 'actions';
import filter from 'lodash/filter'
import moment from 'moment'
import Search from 'Search'
import Jersey from 'Jersey'

class JerseyIssueList extends React.Component{

  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(updateNavTitle("/m/jersey", "Jersey Issue"));
  }

  render() {
    const {jerseyPending} = this.props;
    var html = []
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

 function mapStateToProps (state) {
   return {
     jerseyPending : filter(state.payments, o => {
       return o.jerseyIssued === false && moment(o.date).isAfter('2017-12-31', 'year') && o.centreId === state.selection.id
     })
   }
 }


 export default connect(mapStateToProps)(JerseyIssueList);
