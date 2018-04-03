import React from "react";
import { Row, Col, Glyphicon, Badge } from "react-bootstrap";
import Switch from "Switch";

const Credit = ({ childName, date, updateCreditStatus, credit }) => {
  return (
    <Row style={{ padding: "8px 5px", borderBottom: "1px solid #9a9a9a" }}>
      <Col xs={7} md={7} lg={7} style={{ fontSize: "14px", marginTop: "8px" }}>
        <Glyphicon
          style={{ marginRight: "4px", fontSize: "14px" }}
          glyph="user"
        />
        <font>{childName}</font>
        <Badge style={{ float: "right" }}>{date}</Badge>
      </Col>
      <Col xs={5} md={5} lg={5} style={{ textAlign: "right" }}>
        <Switch
          name={credit.key}
          checked={!credit.inactive}
          onChange={() => {
            updateCreditStatus(credit);
          }}
        />
      </Col>
    </Row>
  );
};

export default Credit;
