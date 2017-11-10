import React from 'react';
import { Glyphicon, Modal } from 'react-bootstrap';

const ClassList = ({
  classes,
  openModal,
  handleDeleteKey,
  handleDeleteType
}) => {
  let html = [];
  html.push(
    <div
      style={{
        backgroundColor: '#9a9a9a',
        padding: '10px',
        color: 'white',
        borderRadius: '5px 5px 0px 0px',
        marginTop: '5px',
        height: '20px'
      }}
      key="Class"
    />
  );
  Object.keys(classes).map(classId => {
    var { ageGroup, classDayTime } = classes[classId];
    html.push(
      <div
        style={{ border: '1px solid #9a9a9a', padding: '10px' }}
        key={classId}
      >
        {ageGroup + ' ' + classDayTime}
        <button
          className="innerbtn"
          style={{ float: 'right' }}
          onClick={e => openModal(e, classId)}
        >
          <Glyphicon glyph="trash" />
        </button>
      </div>
    );
  });

  return (
    <div>
      {html}
    </div>
  );
};

export default ClassList;
