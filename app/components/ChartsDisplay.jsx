import React from 'react';
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
var actions = require('actions');
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

class ChartsDisplay extends React.Component{

  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/charts", "Charts"));
  }

  render() {

   return (
     <Row>
       <Col md={6} xs={12}>
         <ResponsiveContainer minWidth= {300} aspect={2}>
           <BarChart width={600} height={300} data={data}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}>
           <XAxis dataKey="name"/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend />
           <Bar dataKey="pv" stackId="a" fill="#8884d8" />
           <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
          </BarChart>
         </ResponsiveContainer>
       </Col>
     </Row>
   );
  }
 }


 export default connect((state) => {return state;
})(ChartsDisplay);
