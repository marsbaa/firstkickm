import React from 'react';
import {Link} from 'react-router'
import {Row, Col, Glyphicon, Modal, Button} from 'react-bootstrap'
import {connect} from 'react-redux';
import {btn} from 'styles.css'
import Admin from 'Admin'
var actions = require('actions');
import AdminsFilter from 'AdminsFilter'
import Search from 'Search'
import Papa from 'papaparse'

class AdminList extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      adminsName : []
    }
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/admins", "Administrator Profile"));
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }


  handleChange (e) {
    var {dispatch, admins} = this.props
    var adminsName = []
    Papa.parse(e.target.files[0],
      {
        delimiter: "",
        newline: "",
        header: true,
        complete: function(results, file) {
	         Object.keys(results.data).map((id)=> {
             var admin = results.data[id]
             adminsName.push(admin.name)
             dispatch(actions.addAdmin(admin))
           })
     }})
    this.setState({adminsName})
    this.open()
  }

  render() {
    var {admins, searchText} = this.props;

    var filteredAdmins = AdminsFilter.filter(admins, searchText);
    var html=[];
    if (filteredAdmins.length !== 0) {
      console.log(filteredAdmins)
      Object.keys(filteredAdmins).forEach((adminId) => {
        html.push(<Admin key={adminId} admin={filteredAdmins[adminId]} />);
      });
    }
    var adminHTML = [];
    this.state.adminsName.map((name) => {
      adminHTML.push(<div key={name}>
        {name}
      </div>)
    })
   return (
     <div>
       <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center', textAlign: 'right'}}>
         <Col xs={7} md={7}>
           <Search type="admin" />
         </Col>
         <Col xs={5} md={5}>
             <Link to="/m/admins/add"><button className="btn" style={{backgroundColor: '#f5bb05', margin: '0px'}}>Add Admin</button></Link>
             <input name="file" id="file" className="inputfile" type="file" accept=".csv" onChange={this.handleChange.bind(this)} />
             <label htmlFor="file"><Glyphicon glyph="upload" /></label>
         </Col>
       </Row>
       <Modal show={this.state.showModal} onHide={this.close}>
       <Modal.Header closeButton>
         <b>Administrator Added :</b>
       </Modal.Header>
       <Modal.Body>
         {adminHTML}
       </Modal.Body>
       <Modal.Footer>
         <Button onClick={this.close}>Close</Button>
       </Modal.Footer>
     </Modal>
      {html}
    </div>
   );
 }
 }

 export default connect((state) => {return state;
})(AdminList);
