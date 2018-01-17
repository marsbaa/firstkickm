import React from "react";
import { Row, Col, Label} from "react-bootstrap";
import SouTable from "sou-react-table";
import "sou-react-table/SouTable.css";
import {getCalendarDateByYearAndMonth} from 'helper'

const ExpenseList = ({ classes, calendars, year, month }) => {
  let expenseTable = [];

  return (
    <div>
      {Object.keys(classes).map(key => {
        const { name, calendarKey } = classes[key];
        return (
          <div key={key}>
            <Row
              style={{
                padding: "0px 15px"
              }}
            >
              <Col xs={12} md={12}>
                <h5><Label bsStyle="info">{name}</Label></h5>
              </Col>
            </Row>
            <SouTable
              tableData={[
                ["Type", "Field Rental", "Drinks", "Admin"],
                ["6/Jan", "", "", ""],
                ["13/Jan", "", "", ""],
                ["20/Jan", "", "", ""],
                ["27/Jan", "", "", ""]
              ]}
              minTableCol={4}
              minTableRow={4}
              minCellWidth={50}
              cellHeight={28}
              getData={function getData(data) {
                console.log(data);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
