import React from 'react';
import { Glyphicon, Modal } from 'react-bootstrap';

const ClassList = ({
  classes,
  openModal,
  handleDeleteKey,
  handleDeleteType
}) => {
  function open(e, id) {
    e.preventDefault();
    openModal();
    handleDeleteKey(id);
    handleDeleteType('class');
  }
  return (
    <div>
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
      {Object.keys(classes).map(classId => {
        const { name, key } = classes[classId];
        return (
          <div
            style={{ border: '1px solid #9a9a9a', padding: '10px' }}
            key={classId}
          >
            {name}
            <button
              className="innerbtn"
              style={{ float: 'right' }}
              onClick={e => open(e, key)}
            >
              <Glyphicon glyph="trash" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ClassList;
