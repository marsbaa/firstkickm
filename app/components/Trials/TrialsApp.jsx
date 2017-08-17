import React from 'react';
import {
  startAddTrials,
  updateNavTitle,
  isFetching,
  startOpenHouse,
  resetRegister,
  resetParent
} from 'actions';
import { Link } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import union from 'lodash/union';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import Search from 'Search';
import moment from 'moment';
import TrialsFilter from 'TrialsFilter';
import OpenhouseFilter from 'OpenhouseFilter';
import TrialList from 'TrialList';
import Trial from 'Trial';
import Openhouse from 'Openhouse';
import TrialDepositModal from 'TrialDepositModal';
import OpenhouseDepositModal from 'OpenhouseDepositModal';
import Loading from 'Loading';

class TrialsApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showOHModal: false,
      childName: '',
      childNameOH: '',
      id: '',
      key: ''
    };
  }

  componentWillMount() {
    const { dispatch, trials, selection, openhouse } = this.props;
    if (isEmpty(trials)) {
      dispatch(startAddTrials());
    }
    if (isEmpty(openhouse)) {
      dispatch(startOpenHouse());
    }
    dispatch(resetRegister());
    dispatch(resetParent());
    dispatch(updateNavTitle('/m/trials', selection.name + ' Trial List'));
  }

  close(e) {
    this.setState({ showModal: false });
  }

  open(childName, id) {
    this.setState({
      childName,
      id,
      showModal: true
    });
  }

  closeOH(e) {
    this.setState({ showOHModal: false });
  }

  openOH(childNameOH, key) {
    this.setState({
      childNameOH,
      key,
      showOHModal: true
    });
  }

  render() {
    const { trials, searchText, selection, isFetching, openhouse } = this.props;
    let filteredTrials = TrialsFilter.filter(trials, selection.id, searchText);
    let groupDates = groupBy(filteredTrials, 'dateOfTrial');
    let filteredOpenHouse = OpenhouseFilter.filter(
      openhouse,
      selection.name,
      searchText
    );

    let groupOpenHouse = groupBy(filteredOpenHouse, 'dateOfTrial');
    let dates = union(Object.keys(groupDates), Object.keys(groupOpenHouse))
      .sort()
      .reverse();
    return (
      <div>
        <TrialDepositModal
          childName={this.state.childName}
          id={this.state.id}
          show={this.state.showModal}
          close={this.close.bind(this)}
        />
        <OpenhouseDepositModal
          childName={this.state.childNameOH}
          id={this.state.key}
          show={this.state.showOHModal}
          close={this.closeOH.bind(this)}
        />
        {isFetching.completed
          ? <div>
              <Row
                style={{
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Col xs={8} md={8}>
                  <Search type="child" />
                </Col>
                <Col xs={4} md={4}>
                  <Link to="/m/trials/add">
                    <button
                      className="btn"
                      style={{
                        float: 'right',
                        backgroundColor: '#f5bb05',
                        marginBottom: '5px'
                      }}
                    >
                      Add Trial
                    </button>
                  </Link>
                </Col>
              </Row>
              {dates.map(date => {
                const trialByDates = groupDates[date];
                const openhouseByDates = groupOpenHouse[date];
                const trialNum = size(trialByDates) + size(openhouseByDates);
                const attendedNum = reduce(
                  trialByDates,
                  (result, value) => {
                    if (value.attended) {
                      result += 1;
                    }
                    return result;
                  },
                  0
                );
                const formattedDate = moment(date, 'YYYY-MM-DD').format(
                  'DD MMM YYYY'
                );
                return (
                  <div key={date}>
                    <TrialList
                      dateId={formattedDate}
                      trialNum={trialNum}
                      attendedNum={attendedNum}
                    />
                    {size(trialByDates) !== 0
                      ? Object.keys(trialByDates).map(trialId => {
                          const trial = trialByDates[trialId];
                          return (
                            <Trial
                              key={trial.id}
                              trial={trial}
                              open={this.open.bind(this)}
                            />
                          );
                        })
                      : null}
                    {size(openhouseByDates) !== 0
                      ? Object.keys(openhouseByDates).map(oId => {
                          const oh = openhouseByDates[oId];
                          return (
                            <Openhouse
                              key={oh.key}
                              trial={oh}
                              open={this.openOH.bind(this)}
                            />
                          );
                        })
                      : null}
                  </div>
                );
              })}
            </div>
          : <Loading />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selection: state.selection,
    trials: state.trials,
    searchText: state.searchText,
    isFetching: state.isFetching,
    openhouse: state.openhouse
  };
}

export default connect(mapStateToProps)(TrialsApp);
