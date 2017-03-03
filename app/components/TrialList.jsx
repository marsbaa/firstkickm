import React from 'react'
var actions = require('actions');
var {connect} = require('react-redux');
import {Link} from 'react-router';
import {PageHeader, Col, Row} from 'react-bootstrap'
import TrialsFilter from 'TrialsFilter'
import Trial from 'Trial'
import Search from 'Search'
import moment from 'moment'

class TrialList extends React.Component{
  componentDidMount () {
    var {dispatch, selection, ageGroup} = this.props;
    if (_.isEmpty(ageGroup)) {
      dispatch(actions.startAgeGroup());
    }
    var link = "/m/trials";
    dispatch(actions.updateNavTitle(link, "Trial List"));
  }

  render () {
    var {trials, searchText, selection} = this.props;
    var filteredTrials = TrialsFilter.filter(trials, selection, searchText);
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
              <Row key={dateId} style={{backgroundColor: '#656565', padding: '0px 15px', color: '#ffc600'}}>
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
        <Row style={{padding: '8px 10px', borderBottom: '1px solid #cccccc', display: 'flex', alignItems: 'center'}}>
          <Col xs={8} md={8}>
            <Search type="child" />
          </Col>
          <Col xs={4} md={4}>
          <Link to="/m/trials/add"><button className="btn" style={{float: 'right', backgroundColor: '#f5bb05', marginBottom: '5px'}}>Add Trial</button></Link>
          </Col>
        </Row>
        {html}
      </div>
    )
  }
}

export default connect((state) => {return state;
})(TrialList);
