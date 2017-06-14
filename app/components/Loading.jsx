import React from 'react';
import CylonLoading from 'react-loading';
import { Grid, Row, Col } from 'react-bootstrap';

const Loading = () => {
  return (
    <Grid key="loading" style={{ paddingTop: '20px', overflow: 'hidden' }}>
      <Row>
        <Col xs={5} md={5} lg={5} />
        <Col xs={2} md={2} lg={2}>
          <div style={{ margin: 'auto' }}>
            <CylonLoading type="cylon" color="#000000" />
          </div>
        </Col>
        <Col xs={5} md={5} lg={5} />
      </Row>
    </Grid>
  );
};

export default Loading;
