import React from 'react';
import {CSVLink, CSVDownload} from 'react-csv';
import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';

const csvData = [
    [
        'Child Name',
        'Contact',
        'Email',
        'Parent Name',
        'Date of Trial',
        'Time of Trial',
        'Gender',
        'Venue',
        'Medical'
    ]
];

const TrialsCSV = ({trials, centres}) => {
    const groupByCentre = groupBy(trials, 'venueId');
    console.log(groupByCentre)
    Object
        .keys(groupByCentre)
        .map(id => {
            const centre = find(centres, {id: id});
            let centreName;
            if (centre !== undefined) {
                centreName = centre.name;
            }
            let centreTrials = groupByCentre[id]
            centreTrials.map(trial => {
                csvData.push([
                trial.childName,
                trial.contact,
                trial.email,
                trial.parentName,
                trial.dateOfTrial,
                trial.timeOfTrial,
                trial.gender,
                centreName,
                trial.medicalCondition
            ]);
            })
            

        });

    return (
        <CSVLink
            style={{
            marginLeft: '15px',
            color: '#777'
        }}
            data={csvData}>
            Export Trials
        </CSVLink>
    );
};

export default TrialsCSV;
