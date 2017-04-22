import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import ChartsTrial from 'ChartsTrial'
import ChartsStudent from 'ChartsStudent'

class ChartsList extends React.Component {
  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/charts", selection.name+" Charts"));
  }

  render() {

   return (
     <div>
       <ChartsTrial />
       <ChartsStudent />
     </div>

   );
 }
 }

 export default connect((state) => {return state;
})(ChartsList);
