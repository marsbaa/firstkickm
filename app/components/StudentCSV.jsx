import React from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';

const csvData = [
  [
    'Name',
    'Given Name',
    'Group Membership',
    'Phone 1 - Type',
    'Phone 1 - Value'
  ]
];

const StudentCSV = ({ students }) => {
  const activeStudents = filter(students, o => {
    return !(o.status === 'Not Active');
  });
  const groupByCentre = groupBy(activeStudents, 'venueId');
  Object.keys(groupByCentre).map(id => {
    const groupByClass = groupBy(groupByCentre[id], o => {
      if (o.currentClassDay !== undefined) {
        return (
          o.ageGroup +
          ' ' +
          o.currentClassTime +
          ' ' +
          o.currentClassDay.substring(0, 3)
        );
      }
    });
    Object.keys(groupByClass).map(classId => {
      const cla = groupByClass[classId];
      cla.map(student => {
        csvData.push([
          student.childName,
          student.childName,
          classId,
          'mobile',
          student.contact
        ]);
      });
    });
  });

  return (
    <CSVLink style={{ marginLeft: '15px', color: '#777' }} data={csvData}>
      Export Contacts
    </CSVLink>
  );
};

export default StudentCSV;
