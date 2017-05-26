import React from 'react'
var {connect} = require('react-redux')
import {Row, Col, Glyphicon, Grid,Button, Checkbox, FormControl} from 'react-bootstrap'
import {boy, girl} from 'styles.css'
var actions = require('actions')
import {Link} from 'react-router'
import _ from 'lodash'
import moment from 'moment'

class PayerNotPaid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: false
    }
  }

  handleSelect(e) {
    e.preventDefault()
    this.setState({checked: this.state.checked? false: true})
  }


  render() {
    var {dispatch} = this.props;
    var {childName, key, gender, payments, email, contact} = this.props.student;
    var truncatedName = _.truncate(childName, {
  'length': 28});

  return (
     <Grid >
       <Row style={{padding: '8px 5px', borderBottom: '1px solid #9a9a9a'}}>
         <Col xs={7} md={7} lg={7} style={{fontSize: '14px', marginTop: '8px'}}>
           <Link to={"/m/students/edit/" + key} style={{color: 'black', marginRight: '4px'}}><Glyphicon style={{marginRight:'4px', fontSize: '14px'}} glyph='user' /><font className={gender}>{truncatedName}</font></Link>
         </Col>
         <Col xs={5} md={5} lg={5} style={{textAlign:'right'}}>
              <FormControl style={{fontSize: '12px', textAlign: 'center'}}
              id="mobile"
              type="text"
              placeholder="Enter mobile"
              defaultValue={contact}
              />
        </Col>
       </Row>
     </Grid>

    );
  }
}


export default connect((state) => {return state;
})(PayerNotPaid);