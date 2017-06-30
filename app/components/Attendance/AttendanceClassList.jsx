import React from 'react';
import Attendee from 'Attendee';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { countAttended } from 'helper';

class AttendanceClassList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  render() {
    var attended = 0;
    var { group, date, name, makeUps } = this.props;
    var attended = countAttended(group, date);
    console.log(group);
    return (
      <div>
        <Row
          key={name}
          style={{
            backgroundColor: '#656565',
            padding: '0px 15px',
            color: '#ffc600'
          }}
          onClick={() =>
            this.setState({ show: this.state.show ? false : true })}
        >
          <Col xs={9} md={9}>
            <h5>{name}</h5>
          </Col>
          <Col xs={3} md={3} style={{ textAlign: 'center' }}>
            <h5>
              <font style={{ color: 'white' }}>{attended}</font>
              {' '}
              /
              {' '}
              {_.size(group)}
            </h5>
          </Col>
        </Row>
        {this.state.show
          ? Object.keys(group).map(studentId => {
              let filteredMakeUps = _.filter(makeUps, {
                studentKey: group[studentId].key
              });

              let toMakeUp = _.find(filteredMakeUps, o => {
                return moment(date).isSame(o.toDate, 'day');
              });
              let fromMakeUp = _.find(filteredMakeUps, o => {
                return moment(date).isSame(o.fromDate, 'day');
              });
              if (toMakeUp !== undefined) {
                return null;
              } else if (fromMakeUp !== undefined) {
                return (
                  <Attendee
                    key={group[studentId].key}
                    student={group[studentId]}
                    date={date}
                    type="makeUpFrom"
                  />
                );
              } else {
                return (
                  <Attendee
                    key={group[studentId].key}
                    student={group[studentId]}
                    date={date}
                    type="normal"
                  />
                );
              }
            })
          : ''}
      </div>
    );
  }
}

export default AttendanceClassList;
