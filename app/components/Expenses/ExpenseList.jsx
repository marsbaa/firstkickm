import React from "react";
import {Row, Col, Label} from "react-bootstrap";
import SouTable from "sou-react-table";
import "sou-react-table/SouTable.css";
import moment from 'moment'
import find from 'lodash/find'

const ExpenseList = ({classes, dates, updateData, table}) => {
  return (
    <div>
      {classes.map(cla => {
        const {name, calendarKey, key} = cla
        let filteredTable = find(table, {classKey: key})
        let tableData = [
          ["Type", "Field Rental", "Drinks", "Admin"]
        ]
        if (filteredTable !== undefined) {
          tableData = filteredTable.table
        } else {
          dates.map(date => {
            let row = [
              moment(date).format('DD/MMM'),
              "",
              "",
              ""
            ]
            tableData.push(row)
          })
        }
        return (
          <div key={key}>
            <Row style={{
              padding: "0px 15px"
            }}>
              <Col xs={12} md={12}>
                <h5>
                  <Label bsStyle="info">{name}</Label>
                </h5>
              </Col>
            </Row>
            <SouTable
              key={key}
              tableData={tableData}
              minTableCol={2}
              minTableRow={4}
              minCellWidth={50}
              cellHeight={28}
              getData={e => updateData(e, key)}/>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
