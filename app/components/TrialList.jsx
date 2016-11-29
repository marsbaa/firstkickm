import React from 'react'
var actions = require('actions');
var {connect} = require('react-redux');
import {PageHeader, Col, Row} from 'react-bootstrap'
import TrialsFilter from 'TrialsFilter'
import Trial from 'Trial'
import Search from 'Search'
import moment from 'moment'

export var TrialList = React.createClass({
  componentDidMount () {
    var {dispatch, selection} = this.props;
    dispatch(actions.updateNavTitle("/m/cp/tr", "Trial List"));
  },

  render () {
    var {trials, selection, searchText} = this.props;
    var filteredTrials = TrialsFilter.filter(trials, selection.selectedCentre, searchText);
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
              <Row key={dateId} style={{backgroundColor: '#ffc600', padding: '0px 15px'}}>
                <Col xs={9} md={9}>
                  <h5>{moment(dateId).format('DD.MMM YYYY')}</h5>
                </Col>
                  <Col xs={3} md={3} style={{textAlign: 'center'}}>
                    <h5><font style={{color: 'white'}}>{attendedNum}</font> / {trialNum}
                    </h5>
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
        <Search />
        {html}
      </div>
    )
  }
});

export default connect((state) => {return state;
})(TrialList);
