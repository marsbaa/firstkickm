import React from 'react';
var {connect} = require('react-redux');
var actions = require('actions');
import {Row, Col, FormGroup, FormControl, InputGroup, Glyphicon} from 'react-bootstrap'
import search from 'styles.css'

class Search extends React.Component{
  updateSearchText(e){
    e.preventDefault();
    var {dispatch} = this.props;
    dispatch(actions.setSearchText(e.target.value.toLowerCase()));
  }


  render() {
    var {searchText} = this.props;
    var type = this.props.type;

    return (
        <Row style={{padding: '10px'}}>
          <Col xs={12} md={12}>
            <FormGroup style={{marginBottom: '0px'}}>
              <InputGroup>
                <FormControl type="text" placeholder={"Search for " + type} value={searchText} onChange={this.updateSearchText}/>
                    <InputGroup.Addon style={{backgroundColor: '#f5bb05', color: 'white'}}><Glyphicon glyph="search" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
    );
  }
}

export default connect(
  (state) => {
    return state;
  }
)(Search);
