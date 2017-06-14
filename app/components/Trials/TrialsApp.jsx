import React from 'react';
import { startAddTrials, updateNavTitle, isFetching } from 'actions';
import { Link } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import Search from 'Search';
import moment from 'moment';
import TrialsFilter from 'TrialsFilter';
import TrialList from 'TrialList';
import Trial from 'Trial';
import TrialDepositModal from 'TrialDepositModal';
import Loading from 'Loading';

class TrialsApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      childName: '',
      id: ''
    };
  }

  componentWillMount() {
    const { dispatch, trials, selection } = this.props;
    if (isEmpty(trials)) {
      dispatch(startAddTrials());
    }
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

  render() {
    const { trials, searchText, selection, isFetching } = this.props;
    const filteredTrials = TrialsFilter.filter(
      trials,
      selection.id,
      searchText
    );
    const groupDates = groupBy(filteredTrials, 'dateOfTrial');
    return (
      <div>
        <TrialDepositModal
          childName={this.state.childName}
          id={this.state.id}
          show={this.state.showModal}
          close={this.close.bind(this)}
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
              {Object.keys(groupDates).sort().reverse().map(dateId => {
                const trialByDates = groupDates[dateId];
                const trialNum = size(trialByDates);
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
                return (
                  <div key={dateId}>
                    <TrialList
                      dateId={moment(dateId).format('DD.MMM YYYY')}
                      trialNum={trialNum}
                      attendedNum={attendedNum}
                    />
                    {Object.keys(trialByDates).map(trialId => {
                      const trial = trialByDates[trialId];
                      return (
                        <Trial
                          key={trial.id}
                          trial={trial}
                          open={this.open.bind(this)}
                        />
                      );
                    })}
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
    isFetching: state.isFetching
  };
}

export default connect(mapStateToProps)(TrialsApp);
