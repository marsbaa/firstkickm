import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Text
} from 'recharts';
import {getCalendarKeysByCentre, getAllCalendarDatesByYearAndTerm} from 'helper';
import size from 'lodash/size';
import filter from 'lodash/filter';
import moment from 'moment';

const ChartTrialConversion = props => {
  const {calendars, trials, selectedTerm, selectedYear, centres} = props;
  let data = [];
  let totalTrials = 0,
    totalAttended = 0,
    totalRegistered = 0;
  Object
    .keys(centres)
    .map(centreKey => {
      const {id, name} = centres[centreKey];
      //Get Term Dates by centre
      const calendarKeys = getCalendarKeysByCentre(calendars, centreKey);
      const calendarDates = getAllCalendarDatesByYearAndTerm(calendars, calendarKeys, selectedTerm, selectedYear);
      let filteredTrials = filter(trials, {venueId: id});
      filteredTrials = filter(filteredTrials, o => {
        return moment(o.dateOfTrial).isBetween(moment(calendarDates[0]).format('YYYY-MM-DD'), moment(calendarDates[calendarDates.length - 1]).format('YYYY-MM-DD'), null, '[]');
      });
      console.log(filteredTrials)

      const filteredAttended = filter(filteredTrials, {attended: true});

      const filteredRegistered = filter(filteredTrials, {registered: true});

      data.push({name, trials: filteredTrials.length, attended: filteredAttended.length, registered: filteredRegistered.length});
      totalTrials += filteredTrials.length;
      totalAttended += filteredAttended.length;
      totalRegistered += filteredRegistered.length;
    });

  return (
    <div>
      <Row
        style={{
        backgroundColor: '#656565',
        padding: '0px 15px',
        color: '#ffc600'
      }}>
        <Col xs={3} md={3} lg={3}>
          <h5>
            Trials: {totalTrials}
          </h5>
        </Col>
        <Col xs={3} md={3} lg={3}>
          <h5>
            Attended: {totalAttended}
          </h5>
        </Col>
        <Col xs={3} md={3} lg={3}>
          <h5>
            Registered: {totalRegistered}
          </h5>
        </Col>
        <Col xs={3} md={3} lg={3}>
          <h5>
            Conversion: {Math.round(totalRegistered / totalAttended * 100)}%
          </h5>
        </Col>
      </Row>
      <ResponsiveContainer minWidth={300} aspect={1}>
        <BarChart
          layout="vertical"
          width={600}
          height={600}
          data={data}
          margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 5
        }}>
          <XAxis type="number"/>
          <YAxis dataKey="name" type="category"/>
          <CartesianGrid/>
          <Tooltip/>
          <Legend/>
          <Bar dataKey="trials" fill="#cf6362"/>
          <Bar dataKey="attended" fill="#fd9b5a"/>
          <Bar dataKey="registered" fill="#bed499"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartTrialConversion;
