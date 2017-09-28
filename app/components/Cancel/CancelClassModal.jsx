import React from 'react';
import {
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button
} from 'react-bootstrap';

const CancelClassModal = ({ cancelClassList, close, show, onFormSubmit }) => {
  return (
    <Modal show={show} onHide={close()}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Classes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Are you sure you want to cancel these classes?</h6>
        {Object.keys(cancelClassList).map(classKey => {
          const { ageGroup, startTime, endTime, day } = cancelClassList[
            classKey
          ];
          const name = ageGroup + ' ' + startTime + ' - ' + endTime + ' ' + day;
          return (
            <p key={name}>
              {name}
            </p>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close()}>No</Button>
        <Button onClick={onFormSubmit}>Yes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelClassModal;
