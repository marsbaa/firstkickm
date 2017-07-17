import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Checkbox,
  Glyphicon,
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Label
} from 'react-bootstrap';
import moment from 'moment';
import { startToggleOpenhouse } from 'actions';
import { Link } from 'react-router';
import Switch from 'Switch';

class Openhouse extends React.Component {
  render() {
    const { dispatch } = this.props;
    const {
      key,
      childName,
      age,
      contact,
      email,
      attended,
      attendedOn,
      registered,
      dateRegistered,
      deposit
    } = this.props.trial;
    let trialClassName = attended ? 'trialCompleted' : 'trial';
    let truncatedChildName = _.truncate(childName, {
      length: 16
    });

    return (
      <Row
        key={key}
        style={{
          backgroundColor: registered ? '#d7d7d7' : 'none',
          padding: '8px 20px',
          borderBottom: '1px solid #cccccc',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Col xs={2} md={2} lg={2}>
          <Switch
            name={key + 'attended'}
            checked={attended}
            onChange={() => {
              dispatch(startToggleOpenhouse(key));
            }}
          />
        </Col>
        <Col xs={5} md={5} lg={5} style={{ paddingRight: '3px' }}>
          <div style={{ fontSize: '10px', color: '#9a9a9a' }}>
            <Label bsStyle="primary">Openhouse</Label>
          </div>
          <div>
            <font className={trialClassName}>
              {truncatedChildName} ({age})
            </font>
          </div>
          <div style={{ fontSize: '10px', color: '#9a9a9a' }}>
            <Glyphicon style={{ color: '#656565' }} glyph="envelope" /> {email}
          </div>
          <div style={{ fontSize: '10px', color: '#9a9a9a' }}>
            <Glyphicon style={{ color: '#656565' }} glyph="phone" /> {contact}
          </div>
        </Col>
        {registered
          ? <Col xs={5} md={5} lg={5} style={{ textAlign: 'right' }}>
              Registered on {moment(dateRegistered).format('D MMM YYYY')}
            </Col>
          : <Col
              xs={5}
              md={5}
              lg={5}
              style={{
                textAlign: 'right',
                paddingRight: '3px',
                paddingLeft: '3px'
              }}
            >
              <button
                className="innerbtn"
                onClick={() => this.props.open(childName, key)}
              >
                D
                {deposit === undefined
                  ? ''
                  : deposit === '0' ? '' : '$' + deposit}
              </button>
              <Link to={'/m/openhouse/edit/' + key} className="innerbtn">
                <Glyphicon glyph="pencil" style={{ padding: '2px 0px' }} />
              </Link>
              <Link to={'/m/openhouse/register/' + key} className="innerbtn">
                Register
              </Link>
            </Col>}
      </Row>
    );
  }
}

export default connect()(Openhouse);
