import React from 'react'
var actions = require('actions');
var {connect} = require('react-redux');
import {PageHeader, Col, Row} from 'react-bootstrap'
import TrialsFilter from 'TrialsFilter'
import Trial from 'Trial'
import moment from 'moment'

export var TrialList = React.createClass({
  componentDidMount () {
    var {dispatch} = this.props;
    dispatch(actions.updateNavTitle("/m/cp/tr", "Trial List"));
  },

  render () {
    var {trials, selection} = this.props;
    var filteredTrials = TrialsFilter.filter(trials, selection.selectedCentre, "");
    var html=[];

    if (filteredTrials.length !== 0) {

        var groupDates = _.groupBy(filteredTrials, 'dateOfTrial');

        Object.keys(groupDates).sort().reverse().forEach((dateId) => {

            var trialNum = _.size(groupDates[dateId]);

            var attendedNum = _.reduce(groupDates[dateId] , (result, value) => {
              if (value.attended) {
                result += 1;
              }
              return result;
            }, 0);

            html.push(
              <Row key={dateId} style={{backgroundColor: '#cdcdcd', padding: '0 10px', borderBottom: '1px solid grey'}}>
                <Col xs={8} md={8}>
                  <h5>{moment(dateId).format('DD.MMM YYYY')}</h5>
                </Col>
                  <Col xs={2} md={2}>                 <h5 style={{textAlign: 'right'}}>T:{trialNum}</h5>
                </Col>
                <Col xs={2} md={2}>                 <h5 style={{color:'green'}}>A:{attendedNum}</h5>
                </Col>
              </Row>
              );
              _.forEach(groupDates[dateId], (trial) => {
            html.push(<Trial key={trial.id} {...trial} />);
          });
          });
      }

    return (
      <div>
        {html}
      </div>
    )
  }
});

export default connect((state) => {return state;
})(TrialList);
