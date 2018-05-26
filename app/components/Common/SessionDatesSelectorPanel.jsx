import React from "react";
import { Panel, Row, Col } from "react-bootstrap";
import moment from "moment";
import DateButtonGroup from "DateButtonGroup";

const SessionDatesSelectorPanel = props => {
  const { termDates, termId, payerKey, selectedDates } = props;
  return (
    <Panel>
      <Panel.Heading>
        <Row>
          <Col xs={8} md={8}>
            Term {termId}
          </Col>
          <Col xs={4} md={4}>
            <font
              style={{
                fontSize: "14px",
                fontWeight: "normal",
                float: "right",
                textDecoration: "underline"
              }}
            >
              Sessions:{" "}
              {selectedDates !== undefined ? selectedDates.length : null}
            </font>
          </Col>
        </Row>
      </Panel.Heading>
      <Panel.Body>
        <DateButtonGroup
          termDates={termDates}
          termId={termId}
          payerKey={payerKey}
        />
      </Panel.Body>
    </Panel>
  );
};

export default SessionDatesSelectorPanel;
