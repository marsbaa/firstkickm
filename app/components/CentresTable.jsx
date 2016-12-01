import React from 'react';
import {Table, Col, Glyphicon} from 'react-bootstrap'
import {Link} from 'react-router'
import {connect} from 'react-redux';
import CentreRow from 'CentreRow'
import {btn} from 'styles.css'
var actions = require('actions');

export var CentresTable = React.createClass({


  renderCentre() {
    var {centres} = this.props;
    var html = []
    centres.map((centre) => {
      html.push(<CentreRow key={centre.id} c={centre} />);
    });
    return html;
  },

  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/centres", "Centres Profile"));
  },

  render: function () {

   return (
     <div>
         <Link to="/m/cp/0"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}}>Add Centre</button></Link>
       <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th style={{textAlign: 'center'}}>ID</th>
            <th style={{textAlign: 'center'}}>Name</th>
            <th style={{textAlign: 'center'}}>Actions</th>
          </tr>
        </thead>
         <tbody>
          {this.renderCentre()}
        </tbody>
      </Table>

    </div>
   );
 }
 });

 export default connect((state) => {return state;
})(CentresTable);
