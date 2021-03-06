import React from 'react';
import { connect } from 'react-redux';
import { updateNavTitle } from 'actions';
import Centre from 'Centre';
import Search from 'Search';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';
import CentresFilter from 'CentresFilter';
import orderBy from 'lodash/orderBy';

class CentresApp extends React.Component {
  componentDidMount() {
    var { dispatch } = this.props;
    dispatch(updateNavTitle('/m/centres', 'Centres Profile'));
  }
  render() {
    const { centres, searchText } = this.props;
    let orderedCentres = orderBy(centres, 'id', 'asc');
    let filteredCentres = CentresFilter.filter(orderedCentres, searchText);

    return (
      <div>
        <Row
          style={{
            padding: '8px 10px',
            borderBottom: '1px solid #cccccc',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Col xs={8} md={8}>
            <Search type="centre" />
          </Col>
          <Col xs={4} md={4}>
            <Link to="/m/centres/0">
              <button
                className="btn"
                style={{
                  float: 'right',
                  backgroundColor: '#f5bb05',
                  marginBottom: '5px'
                }}
              >
                Add Centre
              </button>
            </Link>
          </Col>
        </Row>
        {Object.keys(filteredCentres).map(centreKey => {
          return <Centre key={centreKey} centre={filteredCentres[centreKey]} />;
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    centres: state.centres,
    searchText: state.searchText
  };
}

export default connect(mapStateToProps)(CentresApp);
