import React from 'react'
import _ from 'lodash'
var actions = require('actions')
var {connect} = require('react-redux')
import ChartsTrial from 'ChartsTrial'
import ChartsStudent from 'ChartsStudent'
import {Grid, Row, Col} from 'react-bootstrap'

class ChartsList extends React.Component {
  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/charts", selection.name+" Charts"));
  }

  render() {

   return (
     <Grid>
       <Row>
         <Col xs={12} md={6} lg={4}>
           <ChartsTrial />
         </Col>
         <Col xs={12} md={6} lg={4}>
           <ChartsStudent />
         </Col>
       </Row>
     </Grid>

   );
 }
 }

 export default connect((state) => {return state;
})(ChartsList);
