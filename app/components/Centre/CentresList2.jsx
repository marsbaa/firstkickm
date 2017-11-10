import React from 'react';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Centre from 'Centre';
import { btn } from 'styles.css';
import Search from 'Search';
import CentresFilter from 'CentresFilter';
var actions = require('actions');
import _ from 'lodash';

class CentresList extends React.Component {
  renderCentre() {
    var { centres, searchText } = this.props;
    var html = [];
    centres = _.orderBy(centres, 'id', 'asc');
    var filteredCentres = CentresFilter.filter(centres, searchText);
    filteredCentres.map(centre => {
      html.push(<Centre key={centre.id} c={centre} />);
    });
    return html;
  }

  componentDidMount() {
    var { dispatch } = this.props;
    dispatch(actions.updateNavTitle('/m/centres', 'Centres Profile'));
  }

  render() {
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
        {this.renderCentre()}
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(CentresList);
