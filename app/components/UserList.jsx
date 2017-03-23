import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import User from 'User'
var actions = require('actions');
import UsersFilter from 'UsersFilter'
import Search from 'Search'

class UserList extends React.Component{


  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/users", "Users Profile"));
  }

  render() {
    var {users, searchText} = this.props;
    var filteredUsers = UsersFilter.filter(users, searchText);
    var html=[];
    if (filteredUsers.length !== 0) {
      Object.keys(filteredUsers).forEach((userId) => {
        html.push(<User key={userId} user={filteredUsers[userId]} />);
      });
    }
   return (
     <div>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={8} md={8}>
           <Search type="user" />
         </Col>
         <Col xs={4} md={4}>
         <Link to="/m/users/add"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}}>Add User</button></Link>
         </Col>
       </Row>
      {html}
    </div>
   );
  }
 }


 export default connect((state) => {return state;
})(UserList);
