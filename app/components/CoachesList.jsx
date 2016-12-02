import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import Coach from 'Coach'
var actions = require('actions');
import CoachesFilter from 'CoachesFilter'
import Search from 'Search'

export var CoachesList = React.createClass({


  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/coaches", "Coaches Profile"));
  },

  render: function () {
    var {coaches, searchText} = this.props;
    var filteredCoaches = CoachesFilter.filter(coaches, searchText);
    var html=[];
    if (filteredCoaches.length !== 0) {
      Object.keys(filteredCoaches).forEach((coachId) => {
        html.push(<Coach key={coachId} coach={filteredCoaches[coachId]} />);
      });
    }
   return (
     <div>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={8} md={8}>
           <Search type="coach" />
         </Col>
         <Col xs={4} md={4}>
         <Link to="/m/coaches/add"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}}>Add Coach</button></Link>
         </Col>
       </Row>
      {html}
    </div>
   );
 }
 });

 export default connect((state) => {return state;
})(CoachesList);
