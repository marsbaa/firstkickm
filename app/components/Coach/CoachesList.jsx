import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Glyphicon, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { btn } from 'styles.css';
import Coach from 'Coach';
import { updateNavTitle } from 'actions';
import CoachesFilter from 'CoachesFilter';
import Search from 'Search';
import Papa from 'papaparse';

class CoachesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      coachesName: []
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  componentDidMount() {
    var { dispatch } = this.props;
    dispatch(updateNavTitle('/m/coaches', 'Coaches Profile'));
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleChange(e) {
    var { dispatch, coaches } = this.props;
    var coachesName = [];
    Papa.parse(e.target.files[0], {
      delimiter: '',
      newline: '',
      header: true,
      complete: function(results, file) {
        Object.keys(results.data).map(id => {
          var coach = results.data[id];
          coachesName.push(coach.name);
          dispatch(actions.addCoach(coach));
        });
      }
    });
    this.setState({ coachesName });
    this.open();
  }

  render() {
    const { coaches, searchText } = this.props;
    var filteredCoaches = CoachesFilter.filter(coaches, searchText);
    var sortedCoaches = _.sortBy(filteredCoaches, ['shortName']);
    var html = [];
    if (sortedCoaches.length !== 0) {
      Object.keys(sortedCoaches).forEach(coachId => {
        html.push(<Coach key={coachId} coach={sortedCoaches[coachId]} />);
      });
    }
    var coachHTML = [];
    this.state.coachesName.map(name => {
      coachHTML.push(
        <div key={name}>
          {name}
        </div>
      );
    });
    return (
      <div>
        <Row
          style={{
            padding: '8px 10px',
            borderBottom: '1px solid #cccccc',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'right'
          }}
        >
          <Col xs={7} md={7}>
            <Search type="coach" />
          </Col>
          <Col xs={5} md={5}>
            <Link to="/m/coaches/add">
              <button
                className="btn"
                style={{ backgroundColor: '#f5bb05', margin: '0px' }}
              >
                Add Coach
              </button>
            </Link>
            <input
              name="file"
              id="file"
              className="inputfile"
              type="file"
              accept=".csv"
              onChange={this.handleChange.bind(this)}
            />
            <label htmlFor="file">
              <Glyphicon glyph="upload" />
            </label>
          </Col>
        </Row>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <b>Coaches Added :</b>
          </Modal.Header>
          <Modal.Body>
            {coachHTML}
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

function mapStateToProps(state) {
  return {
    searchText: state.searchText,
    coaches: state.coaches
  };
}

export default connect(mapStateToProps)(CoachesList);
