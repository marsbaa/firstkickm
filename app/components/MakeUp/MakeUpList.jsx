import React from 'react';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import MakeUp from 'MakeUp';
var actions = require('actions');

class MakeUpList extends React.Component {
  componentDidMount() {
    var { dispatch } = this.props;
    dispatch(actions.updateNavTitle('/m/makeup', 'Make Up'));
  }

  render() {
    var { makeUps, selection, students } = this.props;
    var html = [];
    var centreMakeUps = _.filter(makeUps, { fromCentre: selection.key });
    if (_.size(centreMakeUps) !== 0) {
      html.push(
        <Row
          key="centreMakeUps"
          style={{
            backgroundColor: '#656565',
            padding: '0px 15px',
            color: '#ffc600'
          }}
        >
          <Col xs={12} md={12}>
            <h5>{selection.name} Students Make Ups</h5>
          </Col>
        </Row>
      );
      Object.keys(centreMakeUps).forEach(makeUpId => {
        html.push(
          <MakeUp
            key={makeUpId}
            makeUp={centreMakeUps[makeUpId]}
            student={_.find(students, {
              key: centreMakeUps[makeUpId].studentKey
            })}
          />
        );
      });
    } else {
      html.push(
        <div key="1" style={{ paddingTop: '40px', textAlign: 'center' }}>
          No MakeUps Planned
        </div>
      );
    }
    return (
      <div>
        {html}
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(MakeUpList);
