import React from 'react';
import {Col, Image} from 'react-bootstrap';

export var Features = React.createClass({
  render: function() {
    return (
      <div style={{paddingTop: '30px', paddingBottom:'60px'}}>
        <h3 id="features" style={{textAlign: 'center'}}>AWESOME FEATURES</h3>
        <div className="container" style={{paddingTop: '15px'}}>
          <Col sm={12} md={4} style={{textAlign: 'center', paddingTop: '15px'}}>
            <Image src="images/icon1.png" responsive style={{display: 'block', margin: '15px auto'}}/>
            <h4>Responsive Platform</h4><br/>
            Accessible across mobile<br/>
            phone, tablet and web
          </Col>
          <Col sm={12} md={4} style={{textAlign: 'center', paddingTop: '15px'}}>
            <Image src="images/icon2.png" responsive style={{display: 'block', margin: '15px auto'}}/>
              <h4>Increase Sales</h4><br/>
                Reach out to the right<br/>
                target audience
          </Col>
          <Col sm={12} md={4} style={{textAlign: 'center', paddingTop: '15px'}}>
            <Image src="images/icon3.png" responsive style={{display: 'block', margin: '15px auto'}}/>
              <h4>Analytics</h4><br/>
                Report for your measurement<br/>
                and data collection
          </Col>
        </div>
        <div className="container" style={{paddingTop: '40px'}}>
          <Col sm={12} md={4} style={{textAlign: 'center', paddingTop: '15px'}}>
            <Image src="images/icon4.png" responsive style={{display: 'block', margin: '15px auto'}}/>
            <h4>Responsive Platform</h4><br/>
            Accessible across mobile<br/>
            phone, tablet and web
          </Col>
          <Col sm={12} md={4} style={{textAlign: 'center', paddingTop: '15px'}}>
            <Image src="images/icon5.png" responsive style={{display: 'block', margin: '15px auto'}}/>
              <h4>Increase Sales</h4><br/>
                Reach out to the right<br/>
                target audience
          </Col>
          <Col sm={12} md={4} style={{textAlign: 'center', paddingTop: '15px'}}>
            <Image src="images/icon6.png" responsive style={{display: 'block', margin: '15px auto'}}/>
              <h4>Analytics</h4><br/>
                Report for your measurement<br/>
                and data collection
          </Col>
        </div>

      </div>

    )
  }
});

export default (Features);
