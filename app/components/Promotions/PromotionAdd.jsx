import React from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { updateNavTitle, addPromotion } from 'actions';
import { connect } from 'react-redux';
import moment from 'moment';
import { browserHistory } from 'react-router';

class PromotionAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      startDate: moment(),
      endDate: moment(),
      name: '',
      amount: ''
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(updateNavTitle('/m/promotions', 'Add Promotion'));
  }

  handleStartDateChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date
    });
  }

  handleSelectChange(value) {
    this.setState({ value });
  }

  onFormSubmit() {
    const { dispatch } = this.props;
    const promotion = {
      name: this.state.name,
      centres: this.state.value,
      amount: this.state.amount,
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.state.endDate).format('YYYY-MM-DD')
    };
    dispatch(addPromotion(promotion));
    browserHistory.push('/m/promotions/');
  }

  render() {
    const { centres } = this.props;
    let options = [{ label: 'All Centres', value: 'All' }];
    Object.keys(centres).map(centreKey => {
      const { name } = centres[centreKey];
      options.push({ label: name, value: name });
    });
    console.log(this.state.value);

    return (
      <Grid style={{ marginTop: '20px' }}>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <FormGroup>
              <ControlLabel>Name of Promotion</ControlLabel>
              <FormControl
                id="promoName"
                type="text"
                placeholder="Enter Name of Promotion"
                onChange={e => this.setState({ name: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Select Centre Participating</ControlLabel>
              <Select
                multi
                simpleValue
                disabled={this.state.disabled}
                value={this.state.value}
                placeholder="Select Centre"
                options={options}
                onChange={this.handleSelectChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Amount</ControlLabel>
              <FormControl
                id="amount"
                type="text"
                placeholder="Enter Amount of Discount"
                onChange={e => this.setState({ amount: e.target.value })}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col xs={6}>
            <p style={{ textAlign: 'center' }}>
              <b>Start Date</b>
            </p>
          </Col>
          <Col xs={6}>
            <p style={{ textAlign: 'center' }}>
              <b>End Date</b>
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={6} lg={6}>
            <DatePicker
              inline
              id="startDateSelector"
              selected={this.state.startDate}
              onChange={this.handleStartDateChange}
            />
          </Col>
          <Col xs={6} md={6} lg={6}>
            <DatePicker
              inline
              id="endDateSelector"
              selected={this.state.endDate}
              onChange={this.handleEndDateChange}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <button className="submitbtn" onClick={this.onFormSubmit}>
              Save Promotion
            </button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    centres: state.centres
  };
}

export default connect(mapStateToProps)(PromotionAdd);
