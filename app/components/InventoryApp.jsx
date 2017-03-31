import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

class InventoryApp extends React.Component {
  componentDidMount() {
    var {dispatch, inventory} = this.props;
    if (_.isEmpty(inventory)) {
      dispatch(actions.startInventory());
    }
  }

  render() {
   return (
     <div>
       {this.props.children}
     </div>

   );
 }
 }

 export default connect((state) => {return state;
})(InventoryApp);
