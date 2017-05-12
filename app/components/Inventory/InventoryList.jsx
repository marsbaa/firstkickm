import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import User from 'User'
var actions = require('actions');
import InventoryFilter from 'InventoryFilter'
import Search from 'Search'

class InventoryList extends React.Component{


  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/inventory", "Inventory List"));
  }

  render() {
    var {inventory, searchText} = this.props;
    if (inventory === undefined || inventory.length === 0) {
      var filteredInventory = InventoryFilter.filter(inventory, searchText);
      var html=[];
      if (filteredInventory.length !== 0) {
        Object.keys(filteredInventory).forEach((itemId) => {
          html.push(<Item key={itemId} item={filteredInventory[itemId]} />);
        });
      }
    }

   return (
     <div>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
         <Col xs={8} md={8}>
           <Search type="inventory" />
         </Col>
         <Col xs={4} md={4}>
         <Link to="/m/inventory/add"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}}>Add Item</button></Link>
         </Col>
       </Row>
      {html}
    </div>
   );
  }
 }


 export default connect((state) => {return state;
})(InventoryList);
