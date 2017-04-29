import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')

class NotesApp extends React.Component {
  componentDidMount() {
    var {dispatch, notes} = this.props;
    if (_.isEmpty(notes)) {
      dispatch(actions.startNotes());
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
})(NotesApp);
